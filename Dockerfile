FROM oven/bun:1 as base
WORKDIR /usr/src/app
COPY package.json .
COPY src .
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "index.ts" ]
