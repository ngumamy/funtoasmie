# 🔍 Diagnostic Erreur 500 Backend

## Commandes pour déboguer sur le VPS

```bash
# SSH au VPS
ssh deploy@37.59.118.164
cd /opt/funtoa

# 1️⃣ Voir les logs du backend (les 100 dernières lignes)
docker compose logs backend --tail=100

# 2️⃣ Voir l'état des conteneurs
docker compose ps

# 3️⃣ Vérifier la connexion MySQL
docker compose exec mysql mysql -u root -p$(grep DB_ROOT_PASSWORD .env | cut -d= -f2) -e "SELECT VERSION();"

# 4️⃣ Vérifier que la table users existe
docker compose exec mysql mysql -u raza -p$(grep DB_PASSWORD .env | cut -d= -f2) db_funtoasmie -e "SHOW TABLES;"

# 5️⃣ Vérifier les users existants
docker compose exec mysql mysql -u raza -p$(grep DB_PASSWORD .env | cut -d= -f2) db_funtoasmie -e "SELECT id, email, role FROM User LIMIT 5;"

# 6️⃣ Redémarrer le backend si problème
docker compose restart backend
sleep 5
docker compose logs backend --tail=50
```

## Causes courantes d'erreur 500

| Cause | Symptôme | Solution |
|-------|----------|----------|
| MySQL pas connecté | `ECONNREFUSED` dans logs | `docker compose restart mysql && sleep 10` |
| Table users vide | `Cannot read property of undefined` | Ajouter un utilisateur test |
| Vars d'env manquantes | `JWT_SECRET is undefined` | Vérifier `.env` sur VPS |
| Init.sql pas exécuté | Tables manquantes | `docker volume rm funtoa_mysql_data` puis redéployer |

## Prochaines étapes

1. Exécute les commandes ci-dessus
2. Copie/colle les logs du backend ici
3. Je vais analyser et te dire la solution
