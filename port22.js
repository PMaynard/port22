var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

// Load Config
var config = require('./config/config.json');

server.listen(80);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/html/index.html');
});

io.sockets.on('connection', function (socket) {
	// TODO: Get articles from the database.
  socket.emit('news', config.test );
  socket.on('my other event', function (data) {
    console.log(data);
  });
});