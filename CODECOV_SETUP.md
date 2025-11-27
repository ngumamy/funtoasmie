# Guide Configuration Codecov

## 🎯 Objectif
Codecov fournit des rapports visuels de couverture de code et des commentaires automatiques sur les PRs.

## ✅ Configuration dans GitHub Actions (Déjà fait)

Le workflow `deploy.yml` inclut déjà l'upload automatique:

```yaml
- name: Upload backend coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./backend/coverage/lcov.info
    flags: backend
    name: backend-coverage

- name: Upload frontend coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./frontend/coverage/lcov.info
    flags: frontend
    name: frontend-coverage
```

## 🚀 Setup Codecov

### 1. Se connecter à Codecov
1. Allez sur https://codecov.io
2. Connectez-vous avec GitHub
3. Autorisez l'accès à vos dépôts
4. Sélectionnez le dépôt `funtoasmie`

### 2. Configuration du Dépôt
1. Allez sur https://codecov.io/gh/ilo-CS/funtoasmie
2. Copier le **Repository Upload Token** (optionnel pour les repos publics)
3. (Optionnel) Ajouter à GitHub Secrets:
   - Nom: `CODECOV_TOKEN`
   - Valeur: le token copié

### 3. Vérifier les Paramètres
- **Settings** → **Repository Settings**
- Vérifier que les flags sont correctement configurés (backend, frontend)
- Configurer les règles de couverture si nécessaire

## 📊 Fonctionnalités Activées

### Rapports de Couverture
- Visualisation par fichier et par ligne
- Historique de la couverture
- Comparaison entre branches

### Commentaires Automatiques sur PRs
```
Coverage Report (Backend)
├── Total: 65% (+2%)
├── Files changed: 3/5 (60% coverage)
└── [View Full Report](https://codecov.io/...)
```

### Statut de Commit
- ✅ Approuvé si couverture suffisante
- ⚠️ Avertissement si couverture baisse
- ❌ Peut bloquer les PRs si configuré

## 🔧 Configuration Avancée

### Fichier `codecov.yml` (Déjà créé)
Situé à la racine du projet:

```yaml
coverage:
  range: [70, 100]      # Cible: 70-100%

comment:
  require_head: true    # Commente toutes les PRs
  require_changes: false # Commente même sans changements

flags:
  backend:              # Résultats séparés
    paths:
      - backend
  frontend:
    paths:
      - frontend
```

## 📈 Interprétation des Rapports

### Métriques Principales
- **Statements**: % de déclarations exécutées
- **Branches**: % de branches (if/else) testées
- **Functions**: % de fonctions appelées
- **Lines**: % de lignes exécutées

### Seuils Recommandés
- 🔴 < 50%: Critique - Action nécessaire
- 🟡 50-75%: Acceptable - Amélioration recommandée
- 🟢 75-90%: Bon - Maintenir ce niveau
- 🟢 > 90%: Excellent - Continuer ainsi

## 🔗 Intégrations Utiles

### Ajouter Badge Codecov
Dans votre `README.md`:

```markdown
[![codecov](https://codecov.io/gh/ilo-CS/funtoasmie/branch/main/graph/badge.svg?token=YOUR_TOKEN)](https://codecov.io/gh/ilo-CS/funtoasmie)
```

### Ajouter Checks de Couverture
Dans GitHub:
1. **Settings** → **Branch protection rules** (main)
2. Ajouter status check: `codecov/project/backend` et `codecov/project/frontend`
3. Activer "Require status checks to pass before merging"

## 🐛 Troubleshooting

### Les rapports ne s'upload pas
1. Vérifiez que les tests créent les fichiers `coverage/lcov.info`
2. Vérifiez que le job est bien "test-backend" et "test-frontend"
3. Vérifiez les logs GitHub Actions

### Couverture à 0%
1. Vérifiez que Jest est configuré correctement
2. Vérifiez que `--coverage` est utilisé dans npm test
3. Vérifiez que les fichiers `lcov.info` existent

### Codecov dit "coverage decreased"
1. C'est normal si vous avez peu de tests
2. Augmentez graduellement la couverture
3. Configurez les seuils d'alerte

## 📚 Resources

- [Codecov Docs](https://docs.codecov.io/)
- [codecov-action](https://github.com/codecov/codecov-action)
- [Coverage Best Practices](https://docs.codecov.io/docs/code-coverage-report-upload)

## ✅ Checklist

- [ ] Compte Codecov créé et lié à GitHub
- [ ] Repository sélectionné dans Codecov
- [ ] Fichier `codecov.yml` en place
- [ ] Premier test lancé et upload réussi
- [ ] PR commentée avec résultats de couverture
- [ ] Badge ajouté au README
- [ ] Status check configuré (optionnel)

## 💡 Conseil
Pour cette phase, il est recommandé de:
1. Maintenir une couverture minimum de **50%**
2. Augmenter progressivement vers **70%**
3. Focus sur les endpoints critiques
4. Ignorer les fichiers auto-générés
