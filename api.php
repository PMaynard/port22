<pre>
<?php 
require_once('class.port22-news.php'); 
$news = new port22News();

/* Return something like this: 

{
	"links": [
		{
			"title": "Rawr Hacking Rawr", 
			"url": "http://aaa.com", 
			"timestamp": 0000:00 00,
			"hash": XXXXXXXXX
		},
		{
			"title": "Rawr Hacking Rawr", 
			"url": "http://aaa.com", 
			"timestamp": 0000:00 00,
			"hash": XXXXXXXXX
		}
	]
}
*/
var_dump(json_decode(json_encode(array("links" => $news->getLinksArray(10)))));
?>