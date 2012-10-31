<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" 
	content="text/html;charset=UTF-8">
	<title>#:Port 22 - Security News Feed.</title>
	<link rel="stylesheet/less" href="stylesheet/styles.less">
	<script src="javascript/less.js"></script>
	<script src="javascript/jquery.js"></script>
</head>

<body>
	<header>
		<h1>#:Port 22</h1>
		<h2>Security News Feed.</h2>
	</header>
<?php
$link = mysqli_connect("localhost", "root", "superawesomepass", "port22feeds");

/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

$query = "SELECT title, url FROM feeds ORDER BY timestamp DESC LIMIT 10;";
if ($result = mysqli_query($link, $query)) {
    while ($row = mysqli_fetch_assoc($result)) { ?>
	    <artical>
			<header>
				<? echo "<a target=\"_BLANK\" href=\"{$row["url"]}\">{$row["title"]}</a><br/>\n"; ?>
			</header>
		</artical>
    <? }
    mysqli_free_result($result);
}
mysqli_close($link);
?>
</body>

</html>