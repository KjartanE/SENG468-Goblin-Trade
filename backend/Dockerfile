FROM node:latest

WORKDIR /backend/dev

COPY package*.json ./
RUN npm install && npm cache clean --force
ENV PATH=/backend/node_modules/.bin:$PATH

COPY tsconfig.json ./

COPY src ./src
# BE Container listens on port 4000 at runtime
EXPOSE 4000
# comment if you don't want it to pre-compile
RUN npx tsc
CMD ["npm", "run", "dev"]