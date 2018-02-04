FROM node:8.7.0-alpine
RUN apk update && apk add git
RUN git clone https://github.com/jt3k/chat-linker.git /usr/app && cd /usr/app && git checkout 4aab67aa6a59368896d427f14060c59484ff0a37
RUN cd /usr/app && npm install && npm run build # TODO: Not stable enough; migrate to yarn
COPY app-config.json /usr/app/app-config.json
WORKDIR /usr/app
ENV NODE_ENV prod
CMD ["node", "dist/app.js"]
