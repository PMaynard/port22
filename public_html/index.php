<?php 
  require_once('class.port22-news.php'); 
  $news = new port22News();
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>#:Port 22 - Security News Feed.</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Le Javascript -->
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js"></script>

    <!-- Le styles -->
    <link href="assets/css/bootstrap.css" rel="stylesheet">
    <link href="assets/css/bootstrap-responsive.css" rel="stylesheet">
    <link href="assets/css/port22.css" rel="stylesheet">

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
  </head>

  <body>

  <div class="container-narrow">

  <div class="jumbotron">
    <h1>Security News Feed.</h1>
    <p class="lead">For the latest and greatest security feeds on the net.</p>
  </div>

  <hr>

    <div class="row-fluid marketing">
      <div class="span12">
<?php $news->getLinks(10); ?>
      </div>
    </div>
  </div>
  </body>
</html>
