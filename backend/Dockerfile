FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# BE Container listens on port 8080 at runtime
EXPOSE 8080
# comment if you don't want it to pre-compile
RUN npx tsc
CMD ["node", "app.js"]