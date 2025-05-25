# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto de los archivos
COPY . .

# Construir la aplicación específica (ajusta según necesites)
RUN npm run build reports

# Etapa de producción
FROM node:18-alpine

WORKDIR /app

# Copiar solo lo necesario
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Puerto expuesto
EXPOSE 3000

# Comando para ejecutar (ajusta según tu aplicación principal)
CMD ["node", "dist/apps/reports/main"]