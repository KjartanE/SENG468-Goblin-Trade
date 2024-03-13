FROM node:latest

WORKDIR /order_handler/dev

COPY package*.json ./
RUN npm install && npm cache clean --force
ENV PATH=/order_handler/node_modules/.bin:$PATH

COPY tsconfig.json ./

COPY src ./src
# BE Container listens on port 5000 at runtime
EXPOSE 5000
# comment if you don't want it to pre-compile
RUN npx tsc
CMD ["npm", "run", "dev"]