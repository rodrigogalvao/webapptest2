FROM node:14-alpine

WORKDIR /app

COPY package.json .

RUN npm install --production

COPY server.js .

ENV REDIS_HOST redis
ENV REDIS_PORT 6379

EXPOSE 8080

CMD ["node", "server.js"]
