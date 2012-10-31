<!-- SSH Key test -->
<?php
$link = mysqli_connect("localhost", "spfeeds", "enter-super-ace-password-here12@23", "port22feeds");

/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

$query = "SELECT title, url FROM feeds ORDER BY timestamp DESC;";

if ($result = mysqli_query($link, $query)) {

    /* fetch associative array */
    while ($row = mysqli_fetch_assoc($result)) {
        echo "<a href=\"{$row["url"]}\">{$row["title"]}</a><br/>\n";
    }

    /* free result set */
    mysqli_free_result($result);
}

/* close connection */
mysqli_close($link);
?>
