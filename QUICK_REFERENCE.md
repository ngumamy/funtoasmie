# Quick Reference - Tests & CI/CD Pipeline

## 📋 Commandes Essentielles

### Setup (une seule fois)
```bash
cd backend && npm install && cd ../frontend && npm install && cd ..
```

### Tests Backend
```bash
cd backend
npm test                 # Exécuter
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
npm test -- auth.test.js       # Un fichier spécifique
npm test -- --testNamePattern="email"  # Pattern spécifique
```

### Tests Frontend
```bash
cd frontend
npm test                                # Interactif
npm test -- --watchAll=false           # CI mode
npm test -- --coverage --watchAll=false # Avec coverage
```

### Git & Pipeline
```bash
git status
git add .
git commit -m "feat: description"
git push origin main
# Voir: https://github.com/ilo-CS/funtoasmie/actions
```

---

## 📊 Pipeline GitHub Actions

```
git push
  ↓
Validate (check files)
  ↓
Test Backend (Node 18.x, 20.x) ──┐
                                  ├─→ Build Docker (if OK) ──→ Deploy (if OK)
Test Frontend (Node 18.x, 20.x) ─┘
```

**Temps estimé**: 30-45 minutes  
**En cas d'erreur**: Pipeline s'arrête, email envoyé

---

## 📁 Structure des Tests

```
backend/__tests__/
├── auth.test.js                 # Tests auth
├── validators.test.js           # Tests validation
├── utils.test.js                # Tests utils
└── api.integration.test.js      # Tests API

frontend/src/__tests__/
└── components.test.js           # Tests React
```

**Ajouter de tests**: Créer `__tests__/` ou `*.test.js` n'importe où

---

## 🎯 Métriques

| Métrique | Actuellement | Cible |
|----------|---|---|
| Coverage | 50% | 80%+ |
| Test suites | 4 | tous modules |
| Pass rate | 100% | 100% |

---

## 🔧 Configuration Fichiers

### jest.config.js
```javascript
// Coverage minimum
coverageThreshold: { global: { statements: 50 } }

// Chemins tests
testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js']
```

### .github/workflows/deploy.yml
```yaml
jobs:
  test-backend:   # Node 18.x, 20.x paralèle
  test-frontend:  # Node 18.x, 20.x paralèle
  build-and-push: # Après tests OK
  deploy:         # Après build OK
```

---

## ✅ Checklist Installation

- [ ] `npm install` réussi (backend + frontend)
- [ ] `npm test` passe tous les tests
- [ ] `npm run test:coverage` crée coverage/
- [ ] Git push déclenche GitHub Actions
- [ ] Pipeline complet réussit

---

## 💾 Fichiers Documentations

| Fichier | Pour Qui | Durée |
|---------|----------|-------|
| INDEX.md | Navigation | 5 min |
| QUICK_START_TESTS.md | Démarrage | 5 min |
| TESTING.md | Écrire tests | 30 min |
| TEST_BEST_PRACTICES.md | Bons patterns | 25 min |
| TESTS_SUMMARY.md | Vue d'ensemble | 15 min |
| TESTING_CHECKLIST.md | Vérification | ref |

---

## 🆘 Problèmes Courants

### "Cannot find module 'jest'"
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Tests échouent localement
```bash
npm test -- --verbose    # Voir les erreurs
npm test -- --runInBand  # Sequential (debug)
```

### Pipeline échoue
1. Voir les logs: GitHub Actions → workflow
2. Vérifier: npm test passe en local
3. Vérifier: tous les fichiers sont committés

---

## 📞 Support

- Lire: [`TESTING.md`](TESTING.md)
- Consulter: [`TEST_BEST_PRACTICES.md`](TEST_BEST_PRACTICES.md)
- Implémenter: [`TEST_IMPLEMENTATION_GUIDE.md`](TEST_IMPLEMENTATION_GUIDE.md)
- Debug: [`ADVANCED_TESTING.md`](ADVANCED_TESTING.md)

---

## 🚀 Prochaines Actions

1. `npm install` ✅
2. `npm test` ✅
3. `git push` ✅
4. Ajouter tests réels pour vos contrôleurs
5. Augmenter coverage progressivement

---

**Version**: Quick Ref v1.0  
**Usage**: Garder sous la main  
**Plus**: Voir INDEX.md
