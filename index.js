#!/usr/bin/env node

process.title = "port22";

var Datastore = require('nedb')
var db_news = new Datastore({ filename: 'data/db_news', autoload: true, timestampData: true, inMemoryOnly: false});
var db_urls = new Datastore({ filename: 'data/db_urls', autoload: true, timestampData: true });

var util = require("util");
var feed = require("feed-read");

var fs = require('fs');
var mst = require('mustache');

/* Database Indeices */
db_news.ensureIndex({ fieldName: 'title',  unique: true }, err_constraints());
db_news.ensureIndex({ fieldName: 'author' }, err_constraints());
db_news.ensureIndex({ fieldName: 'source_url' }, err_constraints());

db_urls.ensureIndex({ fieldName: 'url',  unique: true }, function() {});

function init(){
	// /* Check feeds every 5min (300,000ms) 40min (2,400,000) */
	dump_data();
	setInterval(check_feeds, 3000000);
}

function dump_data() {
	util.log("Starting DataDump..")
	db_news.find({}).sort({ createdAt: -1 }).exec( function (err, docs) {
		for(doc in docs){
			fileLoc = "../port22-static/content/news/" + docs[doc]._id + ".md"
			if(fs.existsSync(fileLoc)){
				// util.log("Skipping file", fileLoc)
				continue;
			}
			var template = '\n\
---\n\
title: "{{ title }}"\n\
link: "{{{ link }}}"\n\
date: "{{{ published }}}"\n\
source_url: "{{{ source_url }}}"\n\
source_name: "{{ source_name }}"\n\
\
db_id: "{{ id }}"\n\
db_createdAt: "{{ createdAt }}"\n\
---\n\
\n\
{{{ content }}}\n'

			var data = {
				id: docs[doc]._id, 
				createdAt: docs[doc].createdAt, 
				title: docs[doc].title, 
				link: docs[doc].link, 
				content: docs[doc].content,
				published: new Date(docs[doc].published).toISOString(),
				source_url : docs[doc].source_url,
				source_name : docs[doc].source_name
			}

			var out = mst.render(template, data)
			// util.log(docs)
			util.log(docs[doc].title)
			fs.writeFile(fileLoc, out, function(err) {
			    if(err) {
			        return util.log(err);
			    }
			});
		}
		util.log("DataDump Complete.");
	});
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
						util.log("Error Accessing feed: " + feed_list[i].url);
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
	dump_data();
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

//add_feed("https://lwn.net/headlines/rss", "The LWN.net")

init();
