FROM node:23.11-slim

WORKDIR /app

COPY package*.json ./
RUN npm install -g @nestjs/cli && npm install

COPY . .

WORKDIR /app/apps/reports

RUN npm run build reports

EXPOSE 3000
CMD ["npm", "run", "start", "reports"]
