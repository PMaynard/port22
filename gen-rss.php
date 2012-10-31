<?php header("Content-Type: application/xml; charset=ISO-8859-1"); 
echo '<?xml version="1.0" encoding="ISO-8859-1" ?>'; ?>

<rss version="2.0">
	<channel>
		<title>Port 22</title>
		<link>http://port22.co.uk/feed</link>
<?php
$link = mysqli_connect("localhost","spfeeds","enter-super-ace-password-here12@23", "port22feeds");

/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

$query = "SELECT title, url FROM feeds ORDER BY timestamp DESC LIMIT 25;";
if ($result = mysqli_query($link, $query)) {
    while ($row = mysqli_fetch_assoc($result)) { ?>

		<item>
			<title><? echo $row["title"]; ?></title>
			<link><? echo str_replace("&", "&amp;", $row["url"]); ?></link>
		</item>

    <? }
    mysqli_free_result($result);
}
mysqli_close($link);
?>
	</channel>
</rss>

