FROM node:23.11-slim

WORKDIR /app

COPY package*.json ./
RUN npm install -g @nestjs/cli && npm install

COPY . .

WORKDIR /app/apps/users

RUN npm run build users

EXPOSE 3000

CMD ["npm", "run", "start", "users"]
