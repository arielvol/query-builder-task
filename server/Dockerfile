FROM node:14.14.0-alpine

WORKDIR '/app'

COPY package.json .
RUN npm install
COPY . .

RUN apk add --no-cache make gcc g++ python && \
  npm install && \
  npm rebuild bcrypt --build-from-source && \
  apk del make gcc g++ python

EXPOSE 5005 5432
CMD ["npm", "run", "start"]