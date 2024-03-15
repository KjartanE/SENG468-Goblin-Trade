FROM node:latest

WORKDIR /matching_engine/dev

COPY package*.json ./
RUN npm install && npm cache clean --force
ENV PATH=/matching_engine/node_modules/.bin:$PATH

COPY tsconfig.json ./

COPY src ./src
# Matching Engine Port
EXPOSE 7000
RUN npx tsc
CMD ["npm", "run", "dev"]