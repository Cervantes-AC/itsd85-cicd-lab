FROM node:24-alpine

WORKDIR /app
ENV NODE_ENV=production

# Install production dependencies first so Docker can cache this layer.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src
COPY public ./public

# Set here, after the install, so a new version does not reinstall dependencies.
ARG APP_VERSION=dev
ENV APP_VERSION=$APP_VERSION

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3000/health || exit 1

CMD ["node", "src/server.js"]
