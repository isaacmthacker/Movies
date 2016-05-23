<?php

  $movie = $_GET["movie"];
  $url = "http://www.boxofficemojo.com/data/js/moviegross.php?id=" . $movie . ".htm";

  $output = file_get_contents($url);
  echo $_GET["title"] . "|" . $output;

?>
