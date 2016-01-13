var SERVER_ADDRESS = "https://port22.co.uk/";
var socket = io(SERVER_ADDRESS);

socket.on('connect', function () {
	socket.emit('get_articles', {n: 300});
	socket.emit('get_feeds_list');

	socket.on('article', function (data) {
		display_article(data);
	});

	socket.on('articles', function (data) {
		$("div#news").empty();
		for(var i in data){
			display_article(data[i]);
		};
	});

	socket.on('feed_list', function (data) {
		console.log(data)
		$("ul#feedlist").empty();
		for(var i in data) {
			$("<li><a href=\"{0}\">{1}</a></li>".format([data[i].url, data[i].name])).appendTo('ul#feedlist');
		}
	}); 
});

socket.on('disconnect', function() {
	// TODO: Handle disconnect.
});

function display_article(article){
	$("<p>{2} - <a href=\"{1}\">{0}</a> <br />{3}</p>".format(
		[article.title
		, article.link
		, time_ago_in_words(article.createdAt)
		, article.source_name
		//, article.content
		])).prependTo('div#news'); 
};

/* 
 * Helper function to allow easy format of strings 
 * http://www.codeproject.com/Tips/201899/String-Format-in-JavaScript
 */

String.prototype.format = function (args) {
	var str = this;
	return str.replace(String.prototype.format.regex, function(item) {
		var intVal = parseInt(item.substring(1, item.length - 1));
		var replace;
		if (intVal >= 0) {
			replace = args[intVal];
		} else if (intVal === -1) {
			replace = "{";
		} else if (intVal === -2) {
			replace = "}";
		} else {
			replace = "";
		}
		return replace;
	});
};
String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");
