FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev
COPY build/ ./build/
COPY .env ./
ENTRYPOINT ["node", "build/index.js"]
