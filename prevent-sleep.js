// ///////////////////////////////////
// PREVENT HEROKU APP FROM SLEEPING //
// ///////////////////////////////////

const http = require('http');

const handleRequest = (request, response) => {
  response.end('Works');
};
http.createServer(handleRequest).listen(process.env.PORT || 5000);
setInterval(() => {
  http.get('https://chat-linker.herokuapp.com');
}, 300000);
