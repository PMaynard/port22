<?php 
/* TODO: Move outside of document root and set path require path. */

/* Class returns a list of links from the database */
class port22News{

	private $link;
	private $configDetails;

	/* Open all connections and stuff */
	function __construct() {
		/* Load the DB config details */
		$this->configDetails = parse_ini_file("config/settings.ini", true);
		/* Connect to database */
		$this->link = mysqli_connect(
			$this->configDetails["dbHostname"],
			$this->configDetails["dbUsername"],
			$this->configDetails["dbPassword"], 
			$this->configDetails["dbDatabase"]);
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

	/* Returns a specific number of links. */
	function getLinks($numb) {
		/* Probally should sanitize $numb... */
		$query = "SELECT title, url, timestamp, hash FROM {$this->configDetails["dbTable"]} ORDER BY timestamp DESC LIMIT $numb;";
		if ($result = mysqli_query($this->link, $query)) {
			while ($row = mysqli_fetch_assoc($result)) {
				echo "\t\t<div class=\"linkItem\" >\n";
				echo "\t\t<h4><a target=\"_BLANK\" href=\"{$row["url"]}\">{$row["title"]}</a></h4>\n";
				echo "\t\t<p><b>{$row["timestamp"]}</b> {$row["hash"]}</p>\n";
				echo "\t\t</div>\n";
			}
			mysqli_free_result($result);
		}
	}

	/* Returns a specific number of links as an associative array */
	function getLinksArray($numb) {
		$tmp = array();
		$query = "SELECT title, url, timestamp, hash FROM {$this->configDetails["dbTable"]} ORDER BY timestamp DESC LIMIT $numb;";
		if ($result = mysqli_query($this->link, $query))
			while ($row = mysqli_fetch_assoc($result)) 
				array_push($tmp, $row);
		mysqli_free_result($result);
		return $tmp;
	}

	/* Returns the number of links in the database */
	function getTotalLinks() {
		$query = "SELECT count(title) FROM {$this->configDetails["dbTable"]};";
		if($result = mysqli_query($this->link, $query)){
			$tmp = mysqli_fetch_row($result);
			return $tmp[0];
		}
		return -1;			
	}

}