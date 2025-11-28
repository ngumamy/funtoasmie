#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# 🔐 SSL Certificate Initialization Script for FUNTOA
# ═══════════════════════════════════════════════════════════════════

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="${1:-app.funtoa-smie.com}"
EMAIL="${2:-admin@funtoa-smie.com}"
COMPOSE_FILE="${3:-docker-compose.prod.yml}"

echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🔐 SSL Certificate Initialization${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Configuration:${NC}"
echo "  Domain: $DOMAIN"
echo "  Email: $EMAIL"
echo "  Docker Compose File: $COMPOSE_FILE"
echo ""

# Check if docker-compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
  echo -e "${RED}❌ Error: $COMPOSE_FILE not found!${NC}"
  exit 1
fi

echo -e "${YELLOW}Step 1: Ensure nginx is running...${NC}"
docker compose -f "$COMPOSE_FILE" up -d nginx
sleep 5

echo ""
echo -e "${YELLOW}Step 2: Generate SSL certificate with Certbot...${NC}"
docker compose -f "$COMPOSE_FILE" run --rm certbot certbot certonly \
  --webroot \
  --webroot-path=/usr/share/nginx/html \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN"

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Certificate generation failed!${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}✅ Certificate generated successfully!${NC}"
echo ""

echo -e "${YELLOW}Step 3: Restart all services to apply HTTPS...${NC}"
docker compose -f "$COMPOSE_FILE" down --remove-orphans
sleep 3
docker compose -f "$COMPOSE_FILE" up -d

echo ""
echo -e "${YELLOW}Step 4: Wait for services to be ready...${NC}"
sleep 10

echo ""
echo -e "${YELLOW}Step 5: Check container status...${NC}"
docker compose -f "$COMPOSE_FILE" ps

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ SSL initialization complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}Your application should now be accessible at:${NC}"
echo -e "  🔒 https://$DOMAIN"
echo ""
echo -e "${BLUE}Automatic renewal:${NC}"
echo "  Certbot will automatically renew certificates 30 days before expiration"
echo ""
