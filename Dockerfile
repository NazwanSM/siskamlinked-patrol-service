FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

COPY server.js ./
COPY src ./src

EXPOSE 3020

# Start app
CMD ["node", "server.js"]