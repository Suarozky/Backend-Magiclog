# Usa una imagen oficial de Node.js
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia primero los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de tu código
COPY . .

# Expone el puerto
EXPOSE 3100

# Comando para correr migraciones y luego levantar en modo dev
CMD ["sh", "-c", "ls -la src/database/postgres && npm run migration:run && npm run start:dev"]

