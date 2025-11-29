# 🚀 FUNTOA SMIE - Local & Production Setup

## 📋 Quick Start

### 🏠 LOCAL DEVELOPMENT

```bash
# 1. Copier le fichier .env.local
cp .env.local .env

# 2. Lancer les conteneurs
docker-compose up -d

# 3. Frontend: http://localhost:3000
# 4. Backend API: http://localhost:5000/api
# 5. MySQL: localhost:3306
```

**Test Login (Local)** :
```
Email: admin@funtoa.com
Password: (check init.sql for hashed password)
```

---

### 🌍 PRODUCTION (VPS)

```bash
# 1. Sur le VPS, éditer .env
nano /opt/funtoa/.env

# 2. Utiliser les valeurs de .env.prod comme template
#    - Générer JWT_SECRET: openssl rand -hex 32
#    - Générer DB_PASSWORD: openssl rand -base64 32
#    - Mettre à jour CORS_ORIGIN et REACT_APP_API_URL

# 3. Redémarrer les conteneurs
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# 4. Vérifier les logs
docker-compose logs backend | tail -50
```

**Test Login (Production)** :
```
URL: http://app.funtoa-smie.com/login
Email: admin@funtoa.com
Password: (same as local)
```

---

## 📁 Environment Files

| Fichier | Usage | Committer? |
|---------|-------|-----------|
| `.env.local` | ✅ Local dev template | ✅ OUI (template) |
| `.env.prod` | ✅ Prod template | ✅ OUI (template) |
| `.env.example` | ✅ Global template | ✅ OUI (template) |
| `.env` | ❌ Actual config | ❌ NON (dans .gitignore) |

---

## 🔑 Important Environment Variables

### LOCAL
```
REACT_APP_API_URL=http://localhost:5000/api
CORS_ORIGIN=http://localhost,http://localhost:3000
NODE_ENV=development
```

### PRODUCTION
```
REACT_APP_API_URL=http://app.funtoa-smie.com/api
CORS_ORIGIN=http://app.funtoa-smie.com,https://app.funtoa-smie.com,http://37.59.118.164
NODE_ENV=production
```

---

## 🐛 Troubleshooting

**Frontend appelle la mauvaise URL API?**
→ Vérifier `REACT_APP_API_URL` dans `.env` et relancer `docker-compose up -d --build`

**CORS errors?**
→ Vérifier `CORS_ORIGIN` dans `.env` et inclure l'origine exacte du frontend

**MySQL connection refused?**
→ `docker-compose logs mysql` et vérifier `DB_HOST`, `DB_PORT`, `DB_PASSWORD`

---

## 📚 Architecture

```
LOCAL:
  Frontend: http://localhost:3000 (React dev server)
  Backend:  http://localhost:5000
  Nginx:    -
  MySQL:    localhost:3306

PRODUCTION:
  Frontend: http://app.funtoa-smie.com (via Nginx)
  Backend:  http://app.funtoa-smie.com/api (via Nginx reverse proxy)
  Nginx:    Port 80 (frontend + reverse proxy)
  MySQL:    Internal (port 3306)
```

---

## 🔄 Workflow

```
Local Development
  ↓
  Commit & Push to main
  ↓
  GitHub Actions Workflow
    - Build Docker images
    - Push to GHCR
    - SSH Deploy to VPS
  ↓
  VPS Production
    - Update .env if needed
    - docker-compose pulls new images
    - Containers restart with new code
```

---

## ⚡ Commands

### Local
```bash
# Start
docker-compose up -d

# Logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build
```

### Production (VPS)
```bash
# Check status
docker-compose ps
bash scripts/debug.sh status

# View logs
bash scripts/debug.sh logs backend
bash scripts/debug.sh logs frontend

# Health check
bash scripts/debug.sh health

# Restart
docker-compose restart backend
docker-compose restart frontend
```

---

**Last Updated**: 29/11/2025
