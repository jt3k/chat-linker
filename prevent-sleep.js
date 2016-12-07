// ///////////////////////////////////
// PREVENT HEROKU APP FROM SLEEPING //
// ///////////////////////////////////

const http = require('http');

const handleRequest = (request, response) => {
  response.end('Works');
};
http.createServer(handleRequest).listen(process.env.PORT || 5000);
setInterval(() => {
  http.get('https://translate.google.ru/translate?sl=en&tl=ru&js=y&prev=_t&hl=ru&ie=UTF-8&u=https%3A%2F%2Fchat-linker.herokuapp.com');
}, 300000);
