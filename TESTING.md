
 Testing Guide

## Vue d'ensemble
Ce projet utilise Jest pour les tests unitaires et d'intégration à la fois pour le backend (Node.js/Express) et le frontend (React).

## Architecture des Tests

### Backend Tests
- **Framework**: Jest
- **HTTP Testing**: Supertest
- **Coverage Minimum**: 50%
- **Localisation**: `backend/__tests__/` et `backend/**/*.test.js`

### Frontend Tests
- **Framework**: Jest (intégré via react-scripts)
- **DOM Testing**: React Testing Library
- **Coverage Minimum**: 50%
- **Localisation**: `frontend/src/**/*.test.js`

## Exécution des Tests

### Backend
```bash
cd backend

# Exécuter tous les tests
npm test

# Mode watch (re-exécute les tests à chaque changement)
npm run test:watch

# Générer un rapport de couverture
npm run test:coverage
```

### Frontend
```bash
cd frontend

# Exécuter tous les tests
npm test

# Tests en mode non-interactif (pour CI/CD)
npm test -- --watchAll=false

# Générer un rapport de couverture
npm test -- --coverage --watchAll=false
```

### Tous les tests (depuis la racine)
```bash
npm test
```

## Structure des Tests

### Backend - Exemple
```
backend/
├── __tests__/
│   ├── auth.test.js
│   ├── validators.test.js
│   └── utils.test.js
└── controllers/
    ├── authController.js
    └── authController.test.js (alternative)
```

### Frontend - Exemple
```
frontend/
└── src/
    └── components/
        ├── Auth.js
        └── Auth.test.js
```

## Noms de fichiers de test
- `*.test.js` - Convention principale
- `*.spec.js` - Également supportée
- Placés dans `__tests__/` ou à côté du fichier testé

## Assertions Courantes - Jest

### Tests de valeurs
```javascript
expect(value).toBe(true);
expect(value).toEqual({ name: 'John' });
expect(value).not.toBeNull();
```

### Tests d'objets
```javascript
expect(obj).toHaveProperty('key');
expect(obj).toMatchObject({ key: 'value' });
```

### Tests d'exceptions
```javascript
expect(() => riskyFunction()).toThrow();
expect(() => riskyFunction()).toThrow('specific message');
```

### Tests asynchrones
```javascript
test('async operation', async () => {
  const result = await asyncFunction();
  expect(result).toBe(expected);
});
```

## Backend - Supertest pour API

```javascript
const request = require('supertest');
const app = require('../index');

describe('GET /api/health', () => {
  it('should return 200 OK', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);
    
    expect(response.body).toHaveProperty('status');
  });
});
```

## Couverture de Code

### Générer un rapport
```bash
npm run test:coverage
```

### Interpréter les résultats
- **Statements**: % de déclarations exécutées
- **Branches**: % de branches (if/else) exécutées
- **Functions**: % de fonctions appelées
- **Lines**: % de lignes exécutées

### Voir le rapport HTML
```bash
# Backend
open backend/coverage/lcov-report/index.html

# Frontend
open frontend/coverage/lcov-report/index.html
```

## CI/CD Pipeline

Les tests s'exécutent automatiquement lors d'un push sur `main` ou `master`:
1. ✅ Validation du code
2. ✅ Tests backend (Node 18.x et 20.x)
3. ✅ Tests frontend (Node 18.x et 20.x)
4. ✅ Construction et push des images Docker
5. ✅ Déploiement sur VPS

Le pipeline échoue si:
- Un test échoue
- La couverture est inférieure au seuil défini
- Linting errors (avertissements ignorés)

## Bonnes Pratiques

### 1. Nommage Descriptif
```javascript
// ❌ Mauvais
it('works', () => {
  expect(true).toBe(true);
});

// ✅ Bon
it('should return user data when valid ID is provided', () => {
  const user = getUserById(1);
  expect(user).toHaveProperty('id', 1);
});
```

### 2. Arrange-Act-Assert (AAA)
```javascript
it('should add two numbers correctly', () => {
  // Arrange
  const a = 5;
  const b = 3;
  
  // Act
  const result = add(a, b);
  
  // Assert
  expect(result).toBe(8);
});
```

### 3. Un Test = Une Seule Responsabilité
```javascript
// ❌ Mauvais - teste plusieurs choses
it('should validate email and phone', () => {
  expect(validateEmail('test@example.com')).toBe(true);
  expect(validatePhone('123-456-7890')).toBe(true);
});

// ✅ Bon - un test par fonction
it('should validate email correctly', () => {
  expect(validateEmail('test@example.com')).toBe(true);
});

it('should validate phone correctly', () => {
  expect(validatePhone('123-456-7890')).toBe(true);
});
```

### 4. Tests d'Erreurs
```javascript
it('should throw error for invalid input', () => {
  expect(() => processData(null)).toThrow('Invalid input');
});
```

### 5. Mocks et Spies
```javascript
it('should call database.save', async () => {
  const saveSpy = jest.spyOn(database, 'save');
  
  await saveUser({ name: 'John' });
  
  expect(saveSpy).toHaveBeenCalledWith({ name: 'John' });
  saveSpy.mockRestore();
});
```

## Debugging des Tests

### Mode Watch
```bash
npm run test:watch
```

### Déboguer un seul test
```bash
# Only run one test file
npm test -- auth.test.js

# Only run tests matching a pattern
npm test -- --testNamePattern="should validate email"
```

### Avec Node Debugger
```bash
node --inspect-brk ./node_modules/jest/bin/jest.js --runInBand
```

## Ressources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://jestjs.io/docs/tutorial-react)

## Support

Pour toute question sur les tests, consultez les fichiers d'exemple dans `backend/__tests__/`.
