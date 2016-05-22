<?php
  function splitActor($str) {
    $actorPieces = explode(" ", $str);
    $actor = "";
    foreach($actorPieces as $a) {
      $actor = $actor. $a . "%20";
    }
    return $actor;
  }

  $actor = splitActor($_GET["actor"]);
  $url = "https://en.wikipedia.org/w/api.php?action=query&titles="
          .$actor.
          "filmography&prop=revisions&rvprop=content&format=json";
  $output = file_get_contents($url);

  if(strpos($output, "#REDIRECT")) {
    $firstBrackets = strpos($output, "[[");
    $secondBrackets = strpos($output, "]]");
    if($firstBrackets && $secondBrackets) {
      $actor = substr($output, $firstBrackets+2, $secondBrackets-$firstBrackets-2);
      $actor = splitActor($actor);
      $actor = substr($actor, 0, strlen($actor)-3);
      $url = "https://en.wikipedia.org/w/api.php?action=query&titles="
          .$actor.
          "&prop=revisions&rvprop=content&format=json";
      $output = file_get_contents($url);
    } else {
      echo "ERROR";
    }
  } else if(strpos($output, "missing")) {
      $actor = substr($actor, 0,strlen($actor)-3);
      $url = "https://en.wikipedia.org/w/api.php?action=query&titles="
            .$actor.
            "&prop=revisions&rvprop=content&format=json";
      $output = file_get_contents($url);
  }
  echo $output;

?>
