FROM node:21.6.1-alpine as builder

ENV API_PORT=4000
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g nodemon
COPY . .
EXPOSE 4000
RUN npm run test
CMD ["npm", "start"]