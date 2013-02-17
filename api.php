<?php 
require_once('class.port22-news.php'); 
$news = new port22News();
$db = $news->getDBLink();

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
echo "{\"links\":[";
$query = "SELECT title, url, timestamp, hash FROM feeds ORDER BY timestamp DESC LIMIT 10;";
if ($result = mysqli_query($db, $query))
	while ($row = mysqli_fetch_assoc($result)) 
		echo ",".json_encode($row);
mysqli_free_result($result);
echo "]}";
?>