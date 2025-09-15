FROM oven/bun:1.2.21 AS base
WORKDIR /usr/src/app
COPY package.json .
COPY src src
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "src/index.ts" ]
