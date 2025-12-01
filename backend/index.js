// Core dependencies
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Configuration and utilities
const config = require('./config/config');
const { testConnection } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

// Route handlers
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const companyRoutes = require('./routes/company');
const distributionRoutes = require('./routes/distributions');
const medicationRoutes = require('./routes/medications');
const orderItemRoutes = require('./routes/orderItems');
const orderRoutes = require('./routes/orders');
const prescriptionRoutes = require('./routes/prescriptions');
const consultationRoutes = require('./routes/consultations');
const medicalPrescriptionRoutes = require('./routes/medicalPrescriptions');
const siteRoutes = require('./routes/sites');
const supplierRoutes = require('./routes/suppliers');
const unitRoutes = require('./routes/units');

const app = express();

// -------------------------
// Prometheus instrumentation
// -------------------------
try {
  const client = require('prom-client');

  // Collect default metrics (CPU, memory, node, process, etc.)
  client.collectDefaultMetrics({ timeout: 5000 });

  // HTTP request duration histogram (seconds)
  const httpRequestDurationSeconds = new client.Histogram({
    name: 'backend_http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'status', 'path'],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]
  });

  // HTTP requests counter
  const httpRequestCounter = new client.Counter({
    name: 'backend_http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'status', 'path']
  });

  // Middleware to observe request durations and counts
  app.use((req, res, next) => {
    const start = process.hrtime();
    res.on('finish', () => {
      try {
        const delta = process.hrtime(start);
        const durationSeconds = delta[0] + delta[1] / 1e9;
        const path = req.route && req.route.path ? req.route.path : req.path || req.originalUrl || 'unknown';
        const status = res.statusCode ? String(res.statusCode) : '0';
        httpRequestDurationSeconds.labels(req.method, status, path).observe(durationSeconds);
        httpRequestCounter.labels(req.method, status, path).inc();
      } catch (e) {
        // don't break the response flow on metric errors
        console.debug('Metric collection error', e && e.message);
      }
    });
    next();
  });

  // Expose metrics endpoint BEFORE any rate limiter so Prometheus can scrape reliably
  app.get('/metrics', async (req, res) => {
    try {
      res.set('Content-Type', client.register.contentType);
      res.end(await client.register.metrics());
    } catch (err) {
      res.status(500).end(err && err.message);
    }
  });

} catch (err) {
  console.warn('prom-client not available, skipping metrics setup');
}

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS doit passer AVANT tout middleware qui peut répondre (ex: rate limiter)
const normalizeOrigin = (origin) => {
  if (!origin) return origin;
  // Supprimer le trailing slash
  let normalized = origin.replace(/\/$/, '');
  // Normaliser les ports par défaut (http://example.com:80 -> http://example.com)
  normalized = normalized.replace(/:(80|443)$/, '');
  // Si pas de port et http, considérer comme port 80
  if (normalized.startsWith('http://') && !normalized.match(/:\d+/)) {
    // Ne pas changer, garder tel quel pour la comparaison
  }
  return normalized;
};

const allowedOrigins = Array.isArray(config.cors.origin)
  ? config.cors.origin
  : [config.cors.origin];

const normalizedAllowedOrigins = allowedOrigins.map(normalizeOrigin);

// Ajouter les variantes avec/sans port pour chaque origine
const expandedOrigins = [...new Set([
  ...normalizedAllowedOrigins,
  ...normalizedAllowedOrigins.map(orig => {
    if (orig.startsWith('http://') && !orig.match(/:\d+/)) {
      return `${orig}:80`;
    }
    if (orig.startsWith('https://') && !orig.match(/:\d+/)) {
      return `${orig}:443`;
    }
    return orig;
  }),
  ...normalizedAllowedOrigins.map(orig => orig.replace(/:80$/, '').replace(/:443$/, ''))
])];

app.use(cors({
  origin: (origin, callback) => {
    // Permettre les requêtes sans origine (ex: applications mobiles, Postman, curl)
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = normalizeOrigin(origin);
    
    // Créer une liste d'origines à vérifier (avec et sans port)
    const originsToCheck = [normalizedOrigin];
    if (normalizedOrigin.startsWith('http://') && !normalizedOrigin.match(/:\d+$/)) {
      originsToCheck.push(`${normalizedOrigin}:80`);
    } else if (normalizedOrigin.match(/:80$/)) {
      originsToCheck.push(normalizedOrigin.replace(/:80$/, ''));
    }
    
    const isAllowed =
      expandedOrigins.includes('*') ||
      originsToCheck.some(o => expandedOrigins.includes(o));

    if (isAllowed) {
      return callback(null, true);
    }

    // Log pour débogage
    console.warn(`❌ CORS: Origin ${origin} (normalized: ${normalizedOrigin}) not allowed.`);
    console.warn(`   Checking origins:`, originsToCheck);
    console.warn(`   Allowed origins:`, expandedOrigins);
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: config.cors.credentials,
  methods: config.cors.methods || ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: config.cors.allowedHeaders || ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: config.cors.exposedHeaders || ['Authorization'],
  optionsSuccessStatus: 200 // Pour les anciens navigateurs
}));


// Gérer explicitement les requêtes OPTIONS (preflight) AVANT le rate limiter
// Avoid using route patterns ('/*' or '*') which may be parsed by
// path-to-regexp and throw PathError on some versions. Use a simple
// middleware that intercepts OPTIONS requests instead.
app.use((req, res, next) => {
  if (req.method !== 'OPTIONS') return next();
  const origin = req.headers.origin;
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Max-Age', '86400'); // 24 heures
  }
  return res.sendStatus(200);
});


// Limiteur après CORS pour que les réponses 429 aient les bons en-têtes CORS
app.use(generalLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({
    message: 'FUNTOA SMIE API Server',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    res.json({
      status: 'healthy',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes (alphabetical order)
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/distributions', distributionRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/order-items', orderItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/medical-prescriptions', medicalPrescriptionRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/stocks', require('./routes/stocks'));
app.use('/api/stock-movements', require('./routes/stockMovements'));
app.use('/api/suppliers', supplierRoutes);
app.use('/api/units', unitRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = config.server.port;

const startServer = async () => {
  try {
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Impossible de se connecter à la base de données');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error.message);
    process.exit(1);
  }
};

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));

startServer();
