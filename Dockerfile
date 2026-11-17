FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY largest.js cli.js server.js ./
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
