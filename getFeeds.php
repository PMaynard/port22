<?php

function db(){
	$con = mysql_connect("localhost","spfeeds","enter-super-ace-password-here12@23");
	if (!$con)
	  die('Could not connect: ' . mysql_error());
	mysql_select_db("port22feeds", $con);
	return $con;
}

function addFeed($title, $url){
	$con = db();
	$hash = md5($title.$url);
	$title = mysql_real_escape_string($title);
	$url = mysql_real_escape_string($url);

    mysql_query("INSERT INTO feeds (title, url, timestamp, hash) VALUES('$title', '$url', NOW(), '$hash');");
        //echo("INSERT INTO feeds (title, url, timestamp, hash) VALUES('$title', '$url', NOW(), '$hash');");

	if (mysql_errno() != 1062)
		echo "Added: {$title}<br />\n";

	mysql_close($con);
}

function checkFeeds(){
	// Load in the feed config
	$feeds = parse_ini_file("config/rss-sources.ini", true);

	// Mash the feeds into one
	foreach ($feeds["RSS"] as $name=>$url) {
	    $xml = simplexml_load_file($url);
	    $title = $xml->xpath('//channel/item/title');
	    $link = $xml->xpath('//channel/item/link');

	    for($i = 0; $i < count($title); $i++)
	    	addFeed($title[$i], $link[$i]);    
	} 
}

checkFeeds();

?>