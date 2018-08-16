FROM node:8.7.0-alpine
WORKDIR /usr/app

RUN apk update && apk add git
COPY . /usr/app

RUN npm install
RUN npm run build # TODO: Not stable enough; migrate to yarn

ENV NODE_ENV prod
CMD ["node", "dist/app.js"]
