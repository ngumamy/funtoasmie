# 🚀 Guide d'Installation Rapide - Tests

## ⚡ Setup en 5 Minutes

### 1. Installer les dépendances

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Retour à la racine
cd ..
```

### 2. Vérifier la configuration

```bash
# Exécutable sur Linux/Mac
chmod +x verify-tests.sh
./verify-tests.sh

# Ou manuellement vérifier les fichiers clés
ls -la jest.config.js
ls -la backend/.eslintrc.json
ls -la backend/__tests__/
ls -la frontend/src/__tests__/
```

### 3. Exécuter les tests localement

```bash
# Tests backend
cd backend
npm test

# Tests frontend
cd frontend
npm test -- --watchAll=false
```

## ✅ Vérification Rapide

```bash
# Vérifier que Jest est installé
cd backend
npx jest --version

# Vérifier que les tests passent
npm test

# Vérifier la couverture
npm run test:coverage
```

## 📊 Premier Test Complet

```bash
# 1. Aller dans le répertoire backend
cd backend

# 2. Exécuter les tests
npm test

# 3. Vérifier le résultat
# Vous devriez voir:
# ✓ 3 test suites passed
# ✓ 15 tests passed
```

## 🐛 Troubleshooting

### Erreur: "Cannot find module 'jest'"
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Erreur: "Coverage not found"
```bash
# Générer explicitement la couverture
npm run test:coverage
```

### Tests ne trouvent pas les fichiers
```bash
# Vérifier la structure
ls -la __tests__/
# Devrait voir: auth.test.js, validators.test.js, utils.test.js, api.integration.test.js
```

## 📚 Fichiers Importants

```
✅ jest.config.js                    - Config Jest (root)
✅ backend/.eslintrc.json            - Config ESLint
✅ backend/package.json              - Jest + Supertest
✅ backend/__tests__/                - Tests unitaires
✅ frontend/src/__tests__/           - Tests frontend
✅ .github/workflows/deploy.yml      - Pipeline CI/CD
```

## 🔄 Workflow CI/CD

### Auto-déclenchement
```bash
git push origin main
# → GitHub Actions lance le pipeline automatiquement
# → Tests s'exécutent
# → Build Docker (si tests OK)
# → Deploy VPS (si build OK)
```

### Manuel
```bash
# Via GitHub: Actions → Run workflow → RUN
# Ou via git:
git push origin main  # Déclenche automatiquement
```

## 💾 Faire un Commit

```bash
git add .
git commit -m "feat: add tests to CI/CD pipeline"
git push origin main

# Vérifier le pipeline
# Aller sur: https://github.com/ilo-CS/funtoasmie/actions
# Voir le workflow en cours d'exécution
```

## 📖 Documentation Complète

| Document | Contenu |
|----------|---------|
| `TESTING.md` | Guide complet des tests |
| `TEST_BEST_PRACTICES.md` | Bonnes pratiques |
| `CODECOV_SETUP.md` | Configuration Codecov |
| `TESTS_SUMMARY.md` | Résumé visuel |
| `CHANGELOG-TESTS.md` | Changements détaillés |

## 🎯 Prochaines Étapes

### Immédiat
- [ ] `npm install` (backend et frontend)
- [ ] `npm test` (vérifier que ça passe)
- [ ] `git push` (déclencher le pipeline)
- [ ] Vérifier GitHub Actions

### Court Terme
- [ ] Lire `TESTING.md`
- [ ] Lire `TEST_BEST_PRACTICES.md`
- [ ] Adapter les tests à vos contrôleurs réels
- [ ] Augmenter la couverture de code

### Moyen Terme
- [ ] Configurer Codecov (voir `CODECOV_SETUP.md`)
- [ ] Ajouter des tests d'intégration
- [ ] Ajouter des notifications Slack/Discord
- [ ] Augmenter coverage à 70%+

## ⚙️ Configuration Avancée (Optionnel)

### Ajouter un hook pre-commit
```bash
# Installs husky si nécessaire
npm install husky --save-dev

# Tests avant commit
npx husky add .husky/pre-commit "npm test"
```

### Ajouter Coverage Thresholds
Déjà configuré dans `jest.config.js` (50%)

### Intégrer Prettier (Formatage)
```bash
npm install --save-dev prettier
npx prettier --write .
```

## 📞 Questions Fréquentes

**Q: Les tests doivent-ils passer avant de déployer?**  
R: Oui, le pipeline échoue si les tests échouent.

**Q: Peut-on ignorer un test?**  
R: Oui avec `test.skip()` ou `it.skip()`, mais c'est temporaire.

**Q: Comment augmenter la couverture?**  
R: Ajouter plus de tests dans `__tests__/` ou à côté des fichiers.

**Q: Les tests s'exécutent comment?**  
R: Jest = unitaires, Frontend = React Testing Library

**Q: Coverage obligation?**  
R: Minimum 50%, augmentable dans `jest.config.js`

---

**Status**: ✅ Prêt à l'emploi  
**Temps d'installation**: ~5 minutes  
**Support**: Voir les fichiers `TESTING.md` et `TEST_BEST_PRACTICES.md`
