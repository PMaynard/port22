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

server.listen(80);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/html/index.html');
});

io.sockets.on('connection', function (socket) {
  connection.connect();
  connection.query('SELECT title,url FROM feeds LIMIT 5', function(err, rows, fields) {
  if (err) throw err;

      socket.emit('feed', rows);
  });
  connection.end();
});