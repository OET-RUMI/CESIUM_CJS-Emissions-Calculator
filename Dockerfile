# build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG CESIUM_ION_TOKEN
ENV CESIUM_ION_TOKEN=$CESIUM_ION_TOKEN
ARG CLIMATIQ_API_KEY
ENV CLIMATIQ_API_KEY=$CLIMATIQ_API_KEY
ARG DEVSERVER_PORT
ENV DEVSERVER_PORT=$DEVSERVER_PORT

RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1
