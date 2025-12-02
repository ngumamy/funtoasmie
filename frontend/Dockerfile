FROM node:20-alpine AS builder
LABEL stage="build"
WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force
ARG REACT_APP_API_URL=http://localhost:5000/api
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV NODE_ENV=production
ENV CI=false
COPY . .
RUN printf "REACT_APP_API_URL=%s\n" "${REACT_APP_API_URL}" > .env.production && \
    cat .env.production
RUN npm run build
RUN if [ ! -d "/app/build" ]; then \
      echo "❌ ERREUR: Répertoire /app/build non trouvé après le build!"; \
      ls -la /app/; \
      exit 1; \
    fi && \
    echo "✅ Build réussi: /app/build existe" && \
    ls -la /app/build | head -20
FROM nginx:1.27-alpine AS production
LABEL version="1.0.0"
LABEL description="Frontend FUNTOA SMIE"
LABEL maintainer="ilo-CS"
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
RUN if [ ! -f "/usr/share/nginx/html/index.html" ]; then \
      echo "❌ ERREUR: /usr/share/nginx/html/index.html non trouvé!"; \
      ls -la /usr/share/nginx/html/ || echo "Répertoire vide!"; \
      exit 1; \
    fi && \
    echo "✅ Frontend files copié correctement" && \
    ls -la /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

