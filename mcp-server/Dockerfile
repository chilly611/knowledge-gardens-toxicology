FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
COPY src/ ./src/
RUN npm ci && npx tsc && npm prune --omit=dev
# Env vars (SUPABASE_URL, SUPABASE_ANON_KEY) passed at runtime via -e or docker-compose
ENTRYPOINT ["node", "build/index.js"]
