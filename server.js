const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

exports.handler = (event, context, callback) => {
  const path = event.requestContext.resourcePath;
  const method = event.requestContext.http.method;
  const headers = event.headers;
  const queryStringParameters = event.queryStringParameters;
  const body = event.body ? JSON.parse(event.body) : {};

  if (path === "/") {
    if (method === "GET") {
      // serve the chat UI
      app.get('/', function(req, res){
        res.sendFile(__dirname + '/index.html');
      });
    } else if (method === "POST") {
      // handle chat messages
      io.on('connection', function(socket){
        console.log('a user connected');

        socket.on('disconnect', function(){
          console.log('user disconnected');
        });

        socket.on('chat message', function(msg){
          console.log('message: ' + msg);
          io.emit('chat message', msg);
        });
      });

      // return a successful response
      const response = {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({message: 'Chat messages are being handled.'})
      };
      callback(null, response);
    }
  }
  
  // handle unknown paths
  const response = {
    statusCode: 404,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({message: 'Path not found.'})
  };
  callback(null, response);
};