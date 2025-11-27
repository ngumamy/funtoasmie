# Guide des Bonnes Pratiques - Tests

## 📋 Principes Fondamentaux

### 1. **Isolation et Indépendance**
Chaque test doit être **indépendant** et ne pas dépendre d'autres tests.

```javascript
// ❌ Mauvais - dépend de l'ordre
let user;

test('create user', () => {
  user = { id: 1, name: 'John' };
});

test('update user', () => {
  user.name = 'Jane';
  expect(user.name).toBe('Jane');
});

// ✅ Bon - chaque test est auto-contenu
test('should create user', () => {
  const user = { id: 1, name: 'John' };
  expect(user.id).toBe(1);
});

test('should update user name', () => {
  const user = { id: 1, name: 'John' };
  const updated = { ...user, name: 'Jane' };
  expect(updated.name).toBe('Jane');
});
```

### 2. **Nommage Clair et Descriptif**
Les noms de tests doivent décrire **ce qui est testé** et **le résultat attendu**.

```javascript
// ❌ Mauvais
it('works', () => {});
it('test email', () => {});
it('error', () => {});

// ✅ Bon
it('should validate email format correctly', () => {});
it('should reject invalid email addresses', () => {});
it('should throw error when email is empty', () => {});
```

### 3. **Pattern AAA (Arrange-Act-Assert)**
Structurez chaque test en trois sections:

```javascript
it('should calculate total price with tax', () => {
  // Arrange - Préparer les données
  const items = [
    { name: 'Product A', price: 100 },
    { name: 'Product B', price: 50 }
  ];
  const taxRate = 0.1; // 10%

  // Act - Exécuter la fonction
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const totalWithTax = total * (1 + taxRate);

  // Assert - Vérifier le résultat
  expect(totalWithTax).toBe(165); // (100+50)*1.1
});
```

## 🎯 Types de Tests

### Tests Unitaires
Testent une **fonction ou classe isolée**.

```javascript
describe('emailValidator', () => {
  it('should return true for valid email', () => {
    const result = emailValidator('test@example.com');
    expect(result).toBe(true);
  });

  it('should return false for invalid email', () => {
    const result = emailValidator('invalid-email');
    expect(result).toBe(false);
  });
});
```

### Tests d'Intégration
Testent **plusieurs composants ensemble**.

```javascript
describe('User Registration Flow', () => {
  it('should register user and send confirmation email', async () => {
    const user = await registerUser({
      email: 'new@example.com',
      password: 'SecurePass123'
    });

    expect(user).toHaveProperty('id');
    expect(mockEmailService.send).toHaveBeenCalled();
  });
});
```

### Tests E2E (Frontend)
Testent l'**interaction utilisateur complète**.

```javascript
describe('Login Flow', () => {
  it('should log in user and redirect to dashboard', () => {
    // Simuler interactions utilisateur
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const loginButton = screen.getByText('Login');

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.click(loginButton);

    // Vérifier le résultat
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
```

## 🛠️ Patterns Avancés

### 1. **Mocking et Spying**

```javascript
// Mock une fonction
const mockFn = jest.fn();
mockFn('test');
expect(mockFn).toHaveBeenCalledWith('test');

// Spy sur une méthode
const spy = jest.spyOn(console, 'log');
console.log('Hello');
expect(spy).toHaveBeenCalledWith('Hello');
spy.mockRestore();

// Mock un module entier
jest.mock('../services/api', () => ({
  getUser: jest.fn().mockResolvedValue({ id: 1, name: 'John' })
}));
```

### 2. **Tests Asynchrones**

```javascript
// Avec async/await
test('should fetch user data', async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe('John');
});

// Avec Promises
test('should fetch user data', () => {
  return fetchUser(1).then(user => {
    expect(user.name).toBe('John');
  });
});

// Avec done callback
test('should fetch user data', (done) => {
  fetchUser(1).then(user => {
    expect(user.name).toBe('John');
    done();
  });
});
```

### 3. **Gestion des Timeouts**

```javascript
// Augmenter le timeout pour un test lent
test('should handle slow operation', async () => {
  const result = await slowOperation();
  expect(result).toBeDefined();
}, 10000); // 10 secondes

// Ou au niveau de la suite
describe('Slow Operations', () => {
  jest.setTimeout(15000);
  // Tous les tests ont 15 secondes
});
```

### 4. **Setup et Teardown**

```javascript
describe('Database Tests', () => {
  // Avant chaque test
  beforeEach(() => {
    // Initialiser la base de données
  });

  // Après chaque test
  afterEach(() => {
    // Nettoyer
  });

  // Avant tous les tests
  beforeAll(() => {
    // Setup une seule fois
  });

  // Après tous les tests
  afterAll(() => {
    // Cleanup final
  });
});
```

## 📊 Assertions Courantes

### Comparaisons de Valeurs
```javascript
expect(value).toBe(5);                    // Égalité stricte
expect(value).toEqual(expectedValue);     // Égalité profonde
expect(value).not.toBe(5);                // Négation
```

### Types et Instances
```javascript
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeInstanceOf(Array);
```

### Nombres
```javascript
expect(number).toBeGreaterThan(5);
expect(number).toBeGreaterThanOrEqual(5);
expect(number).toBeLessThan(5);
expect(number).toBeLessThanOrEqual(5);
expect(number).toBeCloseTo(3.14, 1);
```

### Strings
```javascript
expect(str).toMatch(/pattern/);
expect(str).toMatch('substring');
expect(str).toHaveLength(5);
expect(str).toContain('substring');
```

### Arrays et Objects
```javascript
expect(arr).toHaveLength(3);
expect(arr).toContain('item');
expect(arr).toEqual([1, 2, 3]);
expect(obj).toHaveProperty('key');
expect(obj).toMatchObject({ key: 'value' });
```

### Exceptions
```javascript
expect(() => throwError()).toThrow();
expect(() => throwError()).toThrow('Message');
expect(() => throwError()).toThrow(Error);
```

### Mocks
```javascript
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenLastCalledWith('arg1');
expect(mockFn).toHaveBeenNthCalledWith(1, 'arg1');
```

## ✅ Checklist pour de Bons Tests

- [ ] Chaque test a un nom clair et descriptif
- [ ] Les tests sont indépendants les uns des autres
- [ ] Les tests suivent le pattern AAA
- [ ] Une seule assertion par test (idéalement)
- [ ] Les tests testent un comportement, pas une implémentation
- [ ] Les données de test sont minimalistes
- [ ] Les tests sont rapides (< 1s chacun)
- [ ] Les mocks sont utilisés pour les dépendances externes
- [ ] Les tests couvrent les cas normaux ET les erreurs
- [ ] La couverture augmente progressivement

## 🚫 Erreurs Courantes à Éviter

```javascript
// ❌ Tester l'implémentation, pas le comportement
test('should use calculateTotal function', () => {
  const fn = jest.spyOn(calculator, 'calculateTotal');
  calculator.calculateTotal([1, 2, 3]);
  expect(fn).toHaveBeenCalled();
});

// ✅ Tester le résultat
test('should return correct total', () => {
  const result = calculator.calculateTotal([1, 2, 3]);
  expect(result).toBe(6);
});

// ❌ Trop de logique dans le test
test('does everything', () => {
  const user = { name: 'John' };
  user.name = 'Jane';
  const email = user.email || 'default@example.com';
  const isAdmin = user.role === 'admin';
  // 10 assertions...
});

// ✅ Tests focalisés
test('should update user name', () => {
  const updated = updateName({ name: 'John' }, 'Jane');
  expect(updated.name).toBe('Jane');
});

test('should use default email', () => {
  const email = getEmail({});
  expect(email).toBe('default@example.com');
});
```

## 📈 Progression de la Couverture

### Phase 1: Fondations (50%)
- Tests des fonctions critiques
- Cas d'usage normaux et erreurs basiques
- Coverage: ~50%

### Phase 2: Consolidation (70%)
- Tests de tous les services principaux
- Cas limites
- Coverage: ~70%

### Phase 3: Excellence (80%+)
- Tests de tous les modules
- Cas d'erreurs complexes
- Tests de performance
- Coverage: 80%+

## 🔗 Resources

- [Jest Docs](https://jestjs.io)
- [Testing Best Practices](https://testingjavascript.com)
- [Test Driven Development](https://en.wikipedia.org/wiki/Test-driven_development)
