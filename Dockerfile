FROM node:6.9.5
MAINTAINER friedrich@fornever.me
RUN git clone https://github.com/jt3k/chat-linker.git /usr/app/src && cd /usr/app/src && git checkout 8f54762de724ba9caa963b5ba908f0b29e230681
RUN cd /usr/app/src && npm install # TODO: Not stable enough; migrate to yarn
RUN npm run build
COPY app-config.json /usr/app/src/app-config.json
WORKDIR /usr/app/src
CMD ["npm", "run prod"]
