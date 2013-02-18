<?php 
/* TODO: Move outside of document root and set path require path. */

/* Class returns a list of links from the database */
class port22News{

	private $link;

	/* Open all connections and stuff */
	function __construct() {
		/* Load the DB config details */
		$configDetails = parse_ini_file("config/settings.ini", true);
		/* Connect to database */
		$this->link = mysqli_connect(
			$configDetails["dbHostname"],
			$configDetails["dbUsername"],
			$configDetails["dbPassword"], 
			$configDetails["dbDatabase"]);
		/* check connection */
		if (mysqli_connect_errno()) {
		    printf("Connect failed: %s\n", mysqli_connect_error());
		    exit();
		}
	}

	/* Close all connections and stuff */
	function __destruct() {
		mysqli_close($this->link);
	}

	function getDBLink(){
		return $this->link;
	}

	/* Returns a specific number of links. */
	function getLinks($numb) {
		/* Probally should sanitize $numb... */
		$query = "SELECT title, url, timestamp, hash FROM feeds ORDER BY timestamp DESC LIMIT $numb;";
		if ($result = mysqli_query($this->link, $query)) {
			while ($row = mysqli_fetch_assoc($result)) {
				echo "\t\t<h4><a target=\"_BLANK\" href=\"{$row["url"]}\">{$row["title"]}</a></h4>\n";
				echo "\t\t<p><b>{$row["timestamp"]}</b> {$row["hash"]}</p>\n";
			}
			mysqli_free_result($result);
		}
	}

	function getLinksArray($numb) {
		$tmp = array();
		$query = "SELECT title, url, timestamp, hash FROM feeds ORDER BY timestamp DESC LIMIT $numb;";
		if ($result = mysqli_query($this->link, $query))
			while ($row = mysqli_fetch_assoc($result)) 
				array_push($tmp, $row);
		mysqli_free_result($result);
		return $tmp;
	}

}