FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev
COPY build/ ./build/
# Env vars (SUPABASE_URL, SUPABASE_ANON_KEY) passed at runtime via -e or docker-compose
ENTRYPOINT ["node", "build/index.js"]
