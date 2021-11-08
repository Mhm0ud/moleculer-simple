FROM node:14-alpine

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build && npm prune --production

CMD ["npm", "start"]
