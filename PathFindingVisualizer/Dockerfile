FROM node:12.7-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf 
COPY --from=build /usr/src/app/dist/PathFindingVisualizer /usr/share/nginx/html