FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install prisma --save-dev

COPY . .

ENV PORT=8080
ENV NODE_ENV='production'

RUN npx prisma generate

EXPOSE 8080

CMD ["npm", "start"]