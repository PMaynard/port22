<?php

/* Manages pagination */
class port22Pages {
	private $numrows;
	private $rows_per_page = 10;
	//private $lastpage 	   = ceil(($this->$numrows)/($this->$rows_per_page);

	function __construct() {
		require_once('class.port22-news.php'); 
  		$news = new port22News();
  		$this->$numrows = $news->getTotalLinks();
  		//echo "There will be {$lastpage} pages.";
	}
}