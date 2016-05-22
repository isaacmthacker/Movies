<?php
  $actor = $_GET["firstName"] . "%20" . $_GET["lastName"];
  $url = "https://en.wikipedia.org/w/api.php?action=query&titles="
          .$actor.
          "%20filmography&prop=revisions&rvprop=content&format=json";
  $output = file_get_contents($url);
  echo $output;
?>
