FROM node:20-alpine

WORKDIR /quoczuong/threads/backend

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]

