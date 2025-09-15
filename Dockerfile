FROM oven/bun:1.2.21 AS base
WORKDIR /usr/src/app
COPY . .
RUN bun install
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "src/index.ts" ]
