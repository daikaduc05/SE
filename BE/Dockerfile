FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

ENV WEBSITES_ENABLE_APP_SERVICE_STORAGE=true

CMD ["node", "dist/src/main.js"]
