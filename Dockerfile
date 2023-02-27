FROM node:18.3.0-alpine

EXPOSE 4000/tcp

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps --quiet

COPY . ./

CMD npm run start:dev
