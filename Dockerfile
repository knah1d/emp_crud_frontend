# === Stage 1: Build Angular ===
FROM node:latest AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# === Stage 2: Serve Angular ===
FROM nginx:1.27
COPY --from=build /app/dist/emp_crud_frontend/browser/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

