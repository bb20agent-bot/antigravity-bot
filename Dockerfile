# Stage 1: Build the Vite (React) Frontend
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Setup the Node.js Backend Production Environment
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy backend source
COPY server/ ./server/
# Copy built frontend assets
COPY --from=builder /app/dist ./dist

# Expose backend port
EXPOSE 3001

# Command to run the backend which serves the built frontend
CMD ["npx", "ts-node", "server/index.ts"]
