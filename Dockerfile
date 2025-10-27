FROM oven/bun:1.3.1 AS base
WORKDIR /usr/src/app
COPY . .
RUN bun install --frozen-lockfile
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "src/index.ts" ]
