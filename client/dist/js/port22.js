var SERVER_ADDRESS = "https://port22.co.uk/";
var socket = io(SERVER_ADDRESS);

socket.on('connect', function () {
	socket.emit('get_articles', {n: 30});

	socket.on('article', function (data) {
		display_article(data);
	});

	socket.on('articles', function (data) {
		$("div#news").empty();
		for(var i in data){
			display_article(data[i]);
		};
	});
});

socket.on('disconnect', function() {
	// TODO: Handle disconnect.
});

function display_article(article){
	$("<p><a href=\"{1}\">{0}</a><br />{2}<br />{3}<hr>{4}</p>".format(
		[article.title
		, article.link
		, article.createdAt
		, article.source_name
		, article.content
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
