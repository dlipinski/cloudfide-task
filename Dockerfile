# Multi-stage frontend image. Targets:
#   dev  -> Vite dev server (docker-compose.yml)
#   prod -> static bundle served by nginx (docker-compose.prod.yml)

# Shared base with dependencies + source.
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# --- dev: Vite dev server with hot reload ---
FROM base AS dev
EXPOSE 5173
# Bind to 0.0.0.0 so the server is reachable from outside the container.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# --- build: produce the static production bundle ---
FROM base AS build
# VITE_API_URL is baked into the bundle at build time (statically replaced).
ARG VITE_API_URL=http://localhost:5001
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# --- prod: serve the static bundle with nginx (SPA fallback for react-router) ---
FROM nginx:1.27-alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
