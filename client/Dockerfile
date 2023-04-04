FROM node:16 as develop-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g @quasar/cli && \
    npm install -g @vue/cli && \
    npm install -g @vue/cli-init
COPY . .

# build stage
FROM develop-stage as build-stage
RUN npm run build

FROM nginx
EXPOSE 9000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
