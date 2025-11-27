#!/bin/bash
# Script pour vérifier la configuration des tests

echo "=========================================="
echo "🔍 Vérification de la Configuration Tests"
echo "=========================================="
echo ""

# Vérifier les fichiers essentiels
echo "📁 Vérification des fichiers de configuration..."

files=(
  "jest.config.js"
  "backend/.eslintrc.json"
  "backend/__tests__/auth.test.js"
  "backend/__tests__/validators.test.js"
  "backend/__tests__/utils.test.js"
  "backend/__tests__/api.integration.test.js"
  "frontend/src/__tests__/components.test.js"
  ".github/workflows/deploy.yml"
  "TESTING.md"
  "TEST_BEST_PRACTICES.md"
  "CODECOV_SETUP.md"
  "codecov.yml"
)

missing=0
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file - MANQUANT"
    ((missing++))
  fi
done

echo ""
if [ $missing -eq 0 ]; then
  echo "✅ Tous les fichiers sont en place!"
else
  echo "❌ $missing fichier(s) manquant(s)"
fi

echo ""
echo "=========================================="
echo "📦 Vérification des dépendances"
echo "=========================================="
echo ""

# Vérifier backend package.json
echo "Backend package.json:"
if grep -q '"jest"' backend/package.json; then
  echo "✅ Jest est configuré"
else
  echo "❌ Jest non trouvé"
fi

if grep -q '"supertest"' backend/package.json; then
  echo "✅ Supertest est configuré"
else
  echo "❌ Supertest non trouvé"
fi

if grep -q '"test":' backend/package.json; then
  echo "✅ Script test est configuré"
else
  echo "❌ Script test non trouvé"
fi

echo ""
echo "=========================================="
echo "🚀 Prochaines Étapes"
echo "=========================================="
echo ""
echo "1. Installer les dépendances:"
echo "   cd backend && npm install"
echo "   cd ../frontend && npm install"
echo ""
echo "2. Exécuter les tests localement:"
echo "   cd backend && npm test"
echo ""
echo "3. Générer un rapport de couverture:"
echo "   cd backend && npm run test:coverage"
echo ""
echo "4. Push votre code pour déclencher le pipeline:"
echo "   git add ."
echo "   git commit -m 'feat: add tests to CI/CD pipeline'"
echo "   git push"
echo ""
echo "5. Configurer Codecov:"
echo "   Voir CODECOV_SETUP.md"
echo ""
echo "=========================================="
