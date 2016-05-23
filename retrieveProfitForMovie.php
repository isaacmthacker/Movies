<?php

  $movies = $_POST["movies"];
  $url = "https://en.wikipedia.org/w/api.php?action=query&titles="
         . $movies . "&prop=revisions&rvprop=content&format=json";
  $output = file_get_contents($url);
  echo $output;

?>
