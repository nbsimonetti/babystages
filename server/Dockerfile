# BabyStages API container.
FROM node:20-alpine

WORKDIR /app

# Install deps (incl. prisma CLI so we can generate the client).
COPY package*.json ./
RUN npm install

# App source (includes prisma/schema.prisma).
COPY . .

# Generate the Prisma client (no DB connection needed for generate).
RUN npx prisma generate

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

# On a fresh deploy, run migrations once: `npm run prisma:deploy`
# (configure as a release/pre-deploy step on your platform).
CMD ["node", "index.js"]
