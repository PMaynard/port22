#!/usr/bin/env node

process.title = "port22";

var Datastore = require('nedb')
var db_news = new Datastore({ filename: 'data/db_news', autoload: true, timestampData: true, inMemoryOnly: false});
var db_urls = new Datastore({ filename: 'data/db_urls', autoload: true, timestampData: true });

var io = require('socket.io')();
var util = require("util");
var feed = require("feed-read");

var MAX_NUMBER_REQUEST = 30;

db_news.ensureIndex({ fieldName: 'title',  unique: true }, err_constraints());
db_news.ensureIndex({ fieldName: 'author' }, err_constraints());
db_news.ensureIndex({ fieldName: 'source_url' }, err_constraints());

db_urls.ensureIndex({ fieldName: 'url',  unique: true }, function() {});

util.log("Initial Database Update...");
check_feeds();

/* Listen for websocket connections */
io.serveClient(false);
io.listen(8000);
util.log("Server listening on port 8000.");

/* Check feeds every 5min (300,000ms) */
setTimeout(function() {
	util.log("Scheduled Database Update...")
	check_feeds();
}, 300000);

io.on('connection', function(client) {
	client.on('get_articles', function(data) {
		get_articles(client, data.n);
	});

	client.on("disconnect", function() {
		util.log("Client disconnected: " + client.id);
	});
});

function check_feeds() {
	db_urls.find({}, function (err, feed_list) {
		if(err){
			util.log(err.message)
		}

		for(var i in feed_list) {
			parase_feed(feed_list[i].url, feed_list[i].name)
		}
	});
	util.log("Database Update Complete."); 
}

function parase_feed(url, name) {
	feed(url, function(err, articles) {
		if (err){
			util.log(err);
		}else{
			add_articles(url, name, articles);
		};
	});
}

function add_articles(url, name, articles){
	// console.log(name)

	for(var k in articles){
		var article = {
			title: articles[k].title
			, author: articles[k].author
			, link: articles[k].link
			, content: articles[k].content
			, published: articles[k].published
			, source_url : url
			, source_name : name
		};

		db_news.insert(article, function (err, res) {
			if(err && err.errorType === 'uniqueViolated' ) {
				// No need to catch this, we're using constraints to prevent adding duplicates.
				// util.log("Data already there.")
			}else if(err){
				util.log("ERROR: [" + err.errorType + "] " + err.message);
			}else{
				io.emit('article', res);
				util.log(res.title);
			};
		});
	}
}

function get_articles(client, n) {
	if(n >= MAX_NUMBER_REQUEST){
		n = MAX_NUMBER_REQUEST;
	}else if(n <= 0){
		n = 1;
	}
	db_news.find({}).sort({ createdAt: 1 }).skip(1).limit(n).exec( function (err, docs) {
		client.emit('articles', docs);
		util.log("Handling get_articles: " + n)
	});
}

/* Helper Functions */
function err_constraints(err) {
	if(err) {
		util.log(err.message);
	}
};

function add_feed(url, name){
	var feed = {
		url: url, 
		name: name
	};

	console.log(feed)
	db_urls.insert(feed, function (err, res) { });
}