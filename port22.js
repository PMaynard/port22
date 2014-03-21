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

/* -------------------------------------------------- */

server.listen(8080);

// Send the root homepage.
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public_html/index.html');
});

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

/* -------------------------------------------------- */

// Process the feeds every n-blah
new cron('10 * * * * *', function(){
    proccessFeeds();
}, null, true );

/* -------------------------------------------------- */

io.sockets.on('connection', function (socket) {
  connection.query('SELECT title, url, timestamp, hash FROM feeds ORDER by id desc LIMIT 25', function(err, rows, fields) {
  if (err) throw err;
      socket.emit('init', rows);
  });
});


function proccessFeeds() {
	// Get each feed in the configuration.
	var rtn = [];
	for(var i in config.feeds_rss) {
		(function(i) {
			var req = request(config.feeds_rss[i]), feedparser = new FeedParser();

			req.on('error', function (error) { console.log("OPA: Request - ", error); });

			req.on('response', function (res) {
				var stream = this;
				if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
				stream.pipe(feedparser);
			});

			feedparser.on('error', function(error) { console.log("OPA: Feedparser - ", error); });

			feedparser.on('readable', function() {
				// Parse each item.
				var stream = this, item;
				while (item = stream.read()) {
					if(!item.timestamp) item.timestamp = "NOW()";
					// Insert into database.
					if(!item.title)
						console.log("GOTYA");
					var post  = {title: item.title, url: item.url, timestamp: item.timestamp, hash: require('crypto').createHash('md5').update(item.title + item.link).digest("hex")};
					connection.query('INSERT INTO feeds SET ?', post , function(err, result) {
						if(err){
							console.log("OPA: ", err);
						}else if(undefined != result){
							// Update site with any new items.
							var data = [{"title": item.title, "url": item.url, "timestamp": item.timestamp, "hash": require('crypto').createHash('md5').update(item.title + item.link).digest("hex")}];
							io.sockets.emit('update', data);
							rtn.push(data);
						}
					});
				}
			});
		})(i);
	}
	console.log("RTN ", rtn);
}
