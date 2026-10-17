# Multi-stage production Dockerfile for KB Online Shopping Platform
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY packages/shared-types/package*.json ./packages/shared-types/
RUN npm install --omit=dev

# Copy source files
COPY packages/ ./packages/
COPY services/ ./services/
COPY public/ ./public/
COPY orchestrator.js ./

# Expose API Gateway port
EXPOSE 8000

ENV NODE_ENV=production
ENV PORT=8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8000/healthz || exit 1

CMD ["node", "orchestrator.js"]
