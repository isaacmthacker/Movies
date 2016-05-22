function searchActor() {
  var actor = document.getElementById("actor").value.trim().split(" ");

  $.get("retrieve.php?firstName=" + actor[0] + "&lastName=" + actor[1], function(data) {
    console.log(data); 
  });


}
