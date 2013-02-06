<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>#:Port 22 - Security News Feed.</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Le styles -->
    <link href="bootstrap/css/bootstrap.css" rel="stylesheet">
    <style type="text/css">
      body {
        padding-top: 20px;
        padding-bottom: 40px;
      }

      /* Custom container */
      .container-narrow {
        margin: 0 auto;
        max-width: 700px;
      }
      .container-narrow > hr {
        margin: 30px 0;
      }

      /* Main marketing message and sign up button */
      .jumbotron {
        margin: 60px 0;
        text-align: center;
      }
      .jumbotron h1 {
        font-size: 72px;
        line-height: 1;
      }
      .jumbotron .btn {
        font-size: 21px;
        padding: 14px 24px;
      }

      /* Supporting marketing content */
      .marketing {
        margin: 60px 0;
      }
      .marketing p + h4 {
        margin-top: 28px;
      }
    </style>
    <link href="bootstrap/css/bootstrap-responsive.css" rel="stylesheet">

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Fav and touch icons -->
    <link rel="shortcut icon" href="bootstrap/ico/favicon.ico">
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="bootstrap/ico/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="bootstrap/ico/apple-touch-icon-114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="bootstrap/ico/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="bootstrap/ico/apple-touch-icon-57-precomposed.png">
  </head>

  <body>

    <div class="container-narrow">
<!-- 
      <div class="masthead">
       <ul class="nav nav-pills pull-right">
          <li class="active"><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
        </ul> 
        <h3 class="muted">#:Port 22</h3>
      </div>

      <hr> -->

      <div class="jumbotron">
        <h1>Security News Feed.</h1>
        <p class="lead">For the latest and greatest security feeds on the net.</p>
      </div>

      <hr>

      <div class="row-fluid marketing">
              <div class="span6">

<?php
$link = mysqli_connect("localhost","spfeeds","enter-super-ace-password-here12@23", "port22feeds");

/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

$query = "SELECT title, url, timestamp, hash FROM feeds ORDER BY timestamp DESC LIMIT 10;";
if ($result = mysqli_query($link, $query)) {
	$i = 0;
    while ($row = mysqli_fetch_assoc($result)) { 
    	if (($i % 2) == 0) { ?>
				<? echo "<h4><a target=\"_BLANK\" href=\"{$row["url"]}\">{$row["title"]}</a></h4>\n"; ?>
				<? echo "<p>{$row["timestamp"]} {$row["hash"]}</p>\n"; ?>

    <? } $i++; 
	}
    mysqli_free_result($result);
}
mysqli_close($link);
?>
      </div>
              <div class="span6">

<?php
$link = mysqli_connect("localhost","spfeeds","enter-super-ace-password-here12@23", "port22feeds");

/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

$query = "SELECT title, url, timestamp, hash FROM feeds ORDER BY timestamp DESC LIMIT 10;";
if ($result = mysqli_query($link, $query)) {
	$i = 0;
    while ($row = mysqli_fetch_assoc($result)) { 
    	if (($i % 2) != 0) { ?>
				<? echo "<h4><a target=\"_BLANK\" href=\"{$row["url"]}\">{$row["title"]}</a></h4>\n"; ?>
				<? echo "<p>{$row["timestamp"]} {$row["hash"]}</p>\n"; ?>

    <? } $i++; 
	}
    mysqli_free_result($result);
}
mysqli_close($link);
?>
      </div>

      <hr>

    </div> <!-- /container -->

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="bootstrap/js/jquery.js"></script>
    <script src="bootstrap/js/bootstrap-transition.js"></script>
    <script src="bootstrap/js/bootstrap-alert.js"></script>
    <script src="bootstrap/js/bootstrap-modal.js"></script>
    <script src="bootstrap/js/bootstrap-dropdown.js"></script>
    <script src="bootstrap/js/bootstrap-scrollspy.js"></script>
    <script src="bootstrap/js/bootstrap-tab.js"></script>
    <script src="bootstrap/js/bootstrap-tooltip.js"></script>
    <script src="bootstrap/js/bootstrap-popover.js"></script>
    <script src="bootstrap/js/bootstrap-button.js"></script>
    <script src="bootstrap/js/bootstrap-collapse.js"></script>
    <script src="bootstrap/js/bootstrap-carousel.js"></script>
    <script src="bootstrap/js/bootstrap-typeahead.js"></script>

  </body>
</html>
