var app       = require('express')()
  , server    = require('http').createServer(app)
  , io        = require('socket.io').listen(server)
  , mysql     = require('mysql')
  , FeedParser 	= require('feedparser')
  , request   = require('request')
  , cron 	  = require('cron').CronJob
  // Application configuration file.
  , config    = require('./config/config.json')

var connection = mysql.createConnection({
  host     : config.hostname,
  user     : config.user,
  password : config.password,
  database : config.database
});

server.listen(8080);

// Send the root homepage.
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public_html/index.html');
});

// Proccess the feeds every n-blah
new cron('10 * * * * *', function(){
    proccessFeeds();
}, null, true );

// Manually call the update function.
app.get('/update', function (req, res) {
  proccessFeeds();
  res.send('Done');
});

// Debug message.
app.get('/debug', function (req, res) {
	var now = new Date(); 
  io.sockets.emit('update', [{"title":"New Pigeon " + now, "url":"http://nationpigeon.com", "timestamp":+ now, "hash":"AKHDGSAJHDGASJ"}]);
  res.send('Sent Debug message;EOF;');
});

io.sockets.on('connection', function (socket) {
  connection.query('SELECT title, url, timestamp, hash FROM feeds ORDER by id desc LIMIT 25', function(err, rows, fields) {
  if (err) throw err;
      socket.emit('init', rows);
  });
});

function addFeedItem(title, url, timestamp, hash) {
	if(!timestamp) timestamp = "NOW()";

	var post  = {title: title, url: url, timestamp: timestamp, hash: hash};
	connection.query('INSERT INTO feeds SET ?', post , function(err, result) {
		if(err){}
			//console.log(err);
			
		if(undefined != result){
			//console.log(result);
			io.sockets.emit('update', [{"title":title, "url":url, "timestamp":timestamp, "hash":hash}]);
		}
	});
}

function parseFeed(feed_url) {
	var req = request(feed_url), 
		feedparser = new FeedParser();

	req.on('error', function (error) { console.log("Request opa - ", error); });

	req.on('response', function (res) {
		var stream = this;
		if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
		stream.pipe(feedparser);
	});

	feedparser.on('error', function(error) { console.log("Feedparser opa - ", error); });

	feedparser.on('readable', function() {
		var stream = this, item;
		while (item = stream.read()) {
	    	addFeedItem(item.title, item.link, item.date, require('crypto').createHash('md5').update(item.title + item.link).digest("hex"))
		}
	});
}

function proccessFeeds() {
	for(var i in config.feeds_rss) {
		parseFeed(config.feeds_rss[i]);
	}
}
