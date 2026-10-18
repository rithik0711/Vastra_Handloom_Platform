# ==========================================
# Vastra Handloom Platform - Frontend Dockerfile
# Stage 1: Build React/Vite SPA
# Stage 2: Serve with lightweight Nginx
# ==========================================

# --- Stage 1: Build the React Application ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first for efficient Docker layer caching
COPY package*.json ./

# Install all dependencies (including devDependencies required for Vite build)
RUN npm ci

# Copy the full source code
COPY . .

# Build production bundle (outputs to /app/dist)
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration for React Router support and caching
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose web server port
EXPOSE 80

# Health check to verify Nginx is serving content
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
