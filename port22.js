var app       = require('express')()
  , server    = require('http').createServer(app)
  , io        = require('socket.io').listen(server)
  , mysql     = require('mysql')
  // Application configuration file.
  , config    = require('./config/config.json');

var connection = mysql.createConnection({
  host     : config.hostname,
  user     : config.user,
  password : config.password,
  database : config.database
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

connection.end();

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