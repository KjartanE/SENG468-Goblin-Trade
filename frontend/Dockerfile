FROM node:latest

WORKDIR /frontend/dev

COPY package*.json ./
ENV PATH=/frontend/node_modules/.bin:$PATH

RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "start:dev"]