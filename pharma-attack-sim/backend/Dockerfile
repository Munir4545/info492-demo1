FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install build tools for native modules and dependencies
RUN apk add --no-cache python3 make g++ build-base \
  && npm ci --only=production

# Copy application files
COPY . .

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/attacks', (r) => {process.exit(r.statusCode === 401 ? 0 : 1)})"

# Start server
CMD ["node", "server.js"]

