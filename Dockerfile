# Multi-stage production Dockerfile for KB Online Shopping Platform (Next.js 14 + Prisma + PostgreSQL)
FROM node:18-alpine AS runner
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY packages/shared-types/package*.json ./packages/shared-types/
RUN npm install

# Copy application source files
COPY . .

# Build TypeScript types, generate Prisma client, and compile Next.js production bundle
RUN npm run build:types
RUN npx prisma generate
RUN npx next build

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/healthz || exit 1

CMD ["npm", "start"]
