#!/usr/bin/env node

process.title = "port22";

var Datastore = require('nedb')
var db_news = new Datastore({ filename: 'data/db_news', autoload: true, timestampData: true, inMemoryOnly: false});
var db_urls = new Datastore({ filename: 'data/db_urls', autoload: true, timestampData: true });

var io = require('socket.io')();
var util = require("util");
var feed = require("feed-read");

var MAX_NUMBER_REQUEST = 30;
var PORT = 8010;

/* Database Indeices */
db_news.ensureIndex({ fieldName: 'title',  unique: true }, err_constraints());
db_news.ensureIndex({ fieldName: 'author' }, err_constraints());
db_news.ensureIndex({ fieldName: 'source_url' }, err_constraints());

db_urls.ensureIndex({ fieldName: 'url',  unique: true }, function() {});

function init(){
	io.serveClient(false);
	var server = io.listen(PORT);
	util.log("Server listening on port " + PORT);

	io.on('connection', function(client) {
		client.on('get_articles', function(data) {
			get_articles(client, data.n);
		});

		client.on('get_feeds_list', function() {
			get_feeds(client);
		});

		client.on("disconnect", function() {
			util.log("Client disconnected: " + client.id);
		});
	});

	/* Check feeds every 5min (300,000ms) 40min (2,400,000) */
	setInterval(check_feeds, 2400000);
}

function check_feeds() {
	util.log("Database Update...");
	db_urls.find({}, function (err, feed_list) {
		if(err){
			util.log("ERROR: " + err.message);
			return;
		}
		for (var i in feed_list) {
			(function(i) {
				feed(feed_list[i].url, function(err, articles) {
					if (err){
						util.log(err);
						return;
					}
					for(var k in articles){
						(function(k) {
							var article = {
								title: articles[k].title
								, author: articles[k].author
								, link: articles[k].link
								, content: articles[k].content
								, published: articles[k].published
								, source_url : feed_list[i].url
								, source_name : feed_list[i].name
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
							}); // End insert 
	   					})(k); // End K function
	   				} // End for k articles 
				}); // End feed function
			})(i); // End function i
		} // End Feed For
	}); // End .find.
	util.log("Database Update Complete."); 
}

function get_articles(client, n) {
	if(n >= MAX_NUMBER_REQUEST){
		n = MAX_NUMBER_REQUEST;
	}else if(n <= 0){
		n = 1;
	}
	db_news.find({}).sort({ createdAt: -1 }).limit(n).exec( function (err, docs) {
		client.emit('articles', docs.reverse());
		util.log("Handling get_articles: " + n)
	});
}

function get_feeds(client) {
        db_urls.find({}, function (err, docs) {
                client.emit('feed_list', docs);
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

init();
