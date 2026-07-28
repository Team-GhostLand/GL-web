# Setup
FROM node:22-alpine
WORKDIR /usr/src/app
ENV HOST="0.0.0.0"
ENV PORT="3000"
ENV PRESET=node-server
ENV NITRO_HOST="0.0.0.0"
ENV NITRO_PORT="3000"
ENV NITRO_PRESET=node-server

# Build
COPY . .
RUN npm ci
RUN npm run build

# Run
ENTRYPOINT [ "node", ".output/server/index.mjs" ]