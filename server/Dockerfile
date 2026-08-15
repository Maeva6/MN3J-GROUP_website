# Image de production pour l'API MN3J-GROUP (Node + Express + Prisma).
# Multi-stage : on installe/compile dans "builder", puis on ne copie dans
# l'image finale que le strict nécessaire à l'exécution (image plus légère,
# pas d'outils de build qui traînent).

FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src

# ---

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S mn3j && adduser -S mn3j -G mn3j

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY package.json ./
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh && mkdir -p uploads && chown -R mn3j:mn3j /app

USER mn3j

EXPOSE 4000
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "src/index.js"]
