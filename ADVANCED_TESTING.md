# Configuration Avancée des Tests

## 🎯 Sujets Avancés

### 1. Ignore Patterns dans Jest

**Fichier: `jest.config.js`**

```javascript
collectCoverageFrom: [
  "**/*.js",
  "!node_modules/**",      // Ignore node_modules
  "!coverage/**",           // Ignore dossier coverage
  "!**/*.config.js",        // Ignore fichiers config
  "!**/dist/**",            // Ignore fichier build
  "!**/__tests__/**"        // Ignore fichiers de test eux-mêmes
]
```

### 2. Thresholds de Couverture (Mandatory Coverage)

```javascript
coverageThreshold: {
  global: {
    branches: 50,
    functions: 50,
    lines: 50,
    statements: 50
  },
  // Optionnel: par répertoire
  './backend/services/': {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70
  }
}
```

### 3. Transformers et Setup Files

```javascript
transform: {
  '^.+\\.jsx?$': 'babel-jest',
},
setupFilesAfterEnv: [
  '<rootDir>/setup.test.js'  // Fichier d'initialisation
],
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1'  // Alias d'import
}
```

### 4. Configuration par Environnement

```javascript
// jest.config.js
module.exports = {
  projects: [
    // Configuration développement
    {
      displayName: 'dev',
      testEnvironment: 'node',
      testMatch: ['**/__tests__/**/*.js'],
      // Plus rapide, moins de coverage
    },
    // Configuration CI/CD
    {
      displayName: 'ci',
      testEnvironment: 'node',
      testMatch: ['**/__tests__/**/*.js'],
      collectCoverage: true,
      collectCoverageFrom: ['**/*.js', '!node_modules/**']
    }
  ]
};
```

## 🔄 Continuous Integration Avancée

### 1. Test sur Multiples Versions

**Déjà configuré dans le workflow:**

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x]
    # Ajouter des versions:
    # node-version: [16.x, 18.x, 20.x]
```

### 2. Tests Conditionnels

```yaml
# Seulement si des fichiers ont changé
if: |
  contains(github.event.pull_request.modified_files, 'backend')

# Seulement sur les PRs
if: github.event_name == 'pull_request'

# Seulement sur certaines branches
if: github.ref == 'refs/heads/main'
```

### 3. Paramètres Dynamiques

```yaml
env:
  NODE_ENV: test
  DATABASE_URL: ${{ secrets.TEST_DB_URL }}
  COVERAGE_THRESHOLD: 50
```

## 📊 Rapports Avancés

### 1. Générer Plusieurs Formats de Coverage

```bash
# LCOV pour Codecov
npm test -- --coverage --coverageReporters=lcov

# JSON pour parsing personnalisé
npm test -- --coverage --coverageReporters=json

# Tous les formats
npm test -- --coverage --coverageReporters=lcov,json,html,text
```

### 2. HTML Coverage Report

```bash
npm run test:coverage
# Ouvrir: coverage/lcov-report/index.html
```

### 3. Filtrer par Chemin

```bash
# Tests seulement pour un répertoire
npm test -- backend/controllers/

# Tests seulement pour un fichier
npm test -- auth.test.js
```

## 🔐 Sécurité et Secrets

### 1. Masquer les Logs Sensibles

```yaml
- name: Run tests
  run: |
    npm test
  env:
    DATABASE_PASSWORD: ${{ secrets.DB_PASSWORD }}
  # Le secret est masqué dans les logs
```

### 2. Token Codecov

```yaml
- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    token: ${{ secrets.CODECOV_TOKEN }}  # Optionnel pour repos publics
```

## ⚡ Optimisation Performance

### 1. Cache des Dépendances

**Déjà implémenté:**

```yaml
- name: Set up Node.js
  uses: actions/setup-node@v4
  with:
    cache: 'npm'
    cache-dependency-path: backend/package-lock.json
```

**Résultat**: ~2 minutes de gain par test run

### 2. Tests Parallèles (Jest)

```bash
# Par défaut, Jest exécute en parallèle
# Pour désactiver (débogage):
npm test -- --runInBand

# Limiter les workers
npm test -- --maxWorkers=2
```

### 3. Timeout des Tests

```bash
# Timeout global
npm test -- --testTimeout=10000

# Timeout spécifique
test('slow operation', async () => {
  // ...
}, 10000); // 10 secondes
```

## 🎓 Patterns Avancés

### 1. Mocking de Modules

```javascript
// Mock un module complet
jest.mock('../database', () => ({
  query: jest.fn().mockResolvedValue([])
}));

// Mock avec implémentation custom
jest.mock('../auth', () => ({
  verify: jest.fn((token) => {
    return token === 'valid' ? { id: 1 } : null;
  })
}));

// Mock partiel (utiliser original pour certains)
const actual = jest.requireActual('../utils');
jest.mock('../utils', () => ({
  ...actual,
  expensive: jest.fn(() => 'mocked')
}));
```

### 2. Spying Avancé

```javascript
// Spy sur console
const spy = jest.spyOn(console, 'log');
console.log('test');
expect(spy).toHaveBeenCalledWith('test');
spy.mockRestore();

// Mock une propriété
Object.defineProperty(global, 'location', {
  value: { href: 'https://example.com' },
  writable: true
});
```

### 3. Tests Asynchrones Avancés

```javascript
// Fake timers
jest.useFakeTimers();
setTimeout(() => { /* ... */ }, 1000);
jest.runAllTimers();

// Promises
test('async promise', () => {
  return fetch('/api/data').then(data => {
    expect(data).toBeDefined();
  });
});

// Async/Await
test('async await', async () => {
  const data = await fetch('/api/data');
  expect(data).toBeDefined();
});
```

## 📈 Évolution de la Couverture

### Phase 1: 50% Coverage (Actuellement)
```
✅ Tests critiques uniquement
✅ Cas nominaux
⚠️ Cas d'erreur limités
```

### Phase 2: 70% Coverage (3-4 semaines)
```
✅ Tous les services
✅ Cas nominaux complets
✅ Cas d'erreur majeurs
⚠️ Cas limites partiels
```

### Phase 3: 80%+ Coverage (2-3 mois)
```
✅ Couverture complète
✅ Tous les cas d'erreur
✅ Cas limites
✅ Chemins complexes
```

## 🔍 Debugging Avancé

### 1. Debugger VS Code

**.vscode/launch.json:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Debug",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache"],
      "console": "integratedTerminal"
    }
  ]
}
```

### 2. Tests Seulement Certains Fichiers

```bash
# Watch un fichier
npm test -- --watch auth.test.js

# Tests correspondant à un pattern
npm test -- --testNamePattern="email validation"

# Tests dans un dossier
npm test -- --testPathPattern="services"
```

## 🚨 Erreurs Courantes et Solutions

| Erreur | Cause | Solution |
|--------|-------|----------|
| `Cannot find module` | Import incorrect | Vérifier chemin, utiliser alias |
| `Timeout exceeded` | Test trop lent | Augmenter timeout, optimiser code |
| `Coverage below threshold` | Peu de tests | Ajouter tests ou réduire seuil |
| `Mock not working` | Jest en cache | Ajouter `jest.clearAllMocks()` |
| `Async not awaited` | Oubli await | Vérifier async/await ou return |

## 📚 Resources Avancées

- [Jest Configuration](https://jestjs.io/docs/configuration)
- [Jest API Reference](https://jestjs.io/docs/api)
- [GitHub Actions Advanced](https://docs.github.com/en/actions/using-workflows)
- [Codecov Advanced Setup](https://docs.codecov.io/docs)

## ✨ Commandes Utiles

```bash
# Tests avec coverage détaillé
npm test -- --coverage --verbose

# Tests en watch avec coverage
npm test -- --coverage --watch

# Tests avec bail (arrêter au 1er erreur)
npm test -- --bail

# Tests avec seed aléatoire
npm test -- --randomize

# Tests ordered
npm test -- --listTests

# Show coverage
npm test -- --coverage --collectCoverageFrom="src/**/*.js"
```

---

**Niveau**: Avancé  
**Public**: Devs expérimentés  
**Mise à jour**: As needed
