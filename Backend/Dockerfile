# ==========================================
# Vastra Handloom Platform - Backend Dockerfile
# ==========================================

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Copy package manifests first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy the rest of the application code
COPY . .

# Use non-root node user for enhanced security
RUN chown -R node:node /app
USER node

# Expose backend API port
EXPOSE 5000

# Healthcheck to verify the server is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/ || exit 1

# Start the Express server
CMD ["node", "server.js"]
