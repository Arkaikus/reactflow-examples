FROM oven/bun:1.1.22-debian

WORKDIR /app
COPY package.json .
COPY bun.lockb .

RUN bun install @rollup/rollup-linux-x64-gnu
RUN bun install
