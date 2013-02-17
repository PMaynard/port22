<?php 

class port22News{

	$link;

	/* Open all connections and stuff */
	function __construct() {
		$this->$link = mysqli_connect("localhost","spfeeds","enter-super-ace-password-here12@23", "port22feeds");
	}

	/* Close all connections and stuff */
	function __destruct() {
		
	}

	/* Test function to make sure all is working okay */
	function pie() {
		print "All is okay\n"; 
	}
}