FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Generate Prisma client and run migrations on startup
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && npm run start"]
