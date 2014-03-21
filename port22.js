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

// // Proccess the feeds every n-blah
// new cron('10 * * * * *', function(){
//     proccessFeeds();
// }, null, true );

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
  connection.query('SELECT title, url, timestamp, author, categories, hash FROM article ORDER by timestamp desc LIMIT 50', function(err, rows, fields) {
  if (err) throw err;
      socket.emit('init', rows.reverse());
  });
});

function addFeedItem(title, url, timestamp, author, guid, comments, categories, hash) {
	if(!timestamp) timestamp = "NOW()";

	var post  = {title:title, url:url, timestamp:timestamp, author:author, guid:guid, comments:comments, categories:mysql.escape(categories), hash:hash};
	
	connection.query("INSERT INTO article SET ?", post , function(err, result) {
		if(err){
			// Hide the duplicate entry error 
			// console.log(err);
		}
			
		if(undefined != result){
			console.log(result);
			io.sockets.emit('update', [{"title":title, "url":url, "timestamp":timestamp, "author":author, "categories":categories, "hash":hash}]);
		}
	});
	
}

function parseFeed(feed_url) {
	var req = request(feed_url), 
		feedparser = new FeedParser();

	req.on('error', function (error) { console.log("OPA: [Request] ", error, feed_url); });

	req.on('response', function (res) {
		var stream = this;
		if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
		stream.pipe(feedparser);
	});

	feedparser.on('error', function(error) { console.log("OPA: [Feedparser] ", error); });

	feedparser.on('readable', function() {
		var stream = this, item;
		while (item = stream.read()) {	
			// FEED
			// console.log(" -- FEED --");
			// console.log("Feed Title:  	", item.meta.title);
			// console.log("Feed Description:  ", item.meta.description);
			// console.log("Site Link:  		", item.meta.link);
			// console.log("Feed Link:  		", item.meta.xmlurl);
			// console.log("Date:  		", item.meta.date); 	// First
			// console.log("Pubdate:  	", item.meta.pubdate);		// Second; Third NOW() 
			// console.log("Author:  	", item.meta.author);
			// console.log("Copyright:  	", item.meta.copyright);
			// console.log("Generator: 	", item.meta.generator);
			// console.log("Categories:  	", item.meta.categories);
			// ARTICLE
			// console.log(" -- ARTICLE --");
			// console.log("Title: 		", item.title);
			// console.log("Link:  		", (!item.origlink) ? item.link : item.origlink);
			// console.log("Date:  		", item.date); 	
			// console.log("Pubdate:  	", item.pubdate);
			// console.log("Author:  	", item.author);
			// console.log("GUID:  	", item.guid);
			// console.log("Comments:  	", item.comments);
			// console.log("Categories:  	", item.categories);			
			// console.log("-----------------");
			var link = (!item.origlink) ? item.link : item.origlink,
				hash = require('crypto').createHash('md5').update(item.title + link ).digest("hex");
	    	addFeedItem(item.title, link, (!item.date) ? item.pubdate : item.date, item.author, item.guid, item.comments, item.categories, hash)
		}
	});
}

function proccessFeeds() {
	for(var i in config.feed_list) {
		parseFeed(config.feed_list[i]);
	}
}

// (x > 10) ? true : false
