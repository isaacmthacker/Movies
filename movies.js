function searchActor() {
  var actor = document.getElementById("actor").value.trim().replace(/\s/g,"%20");
  var url = "https://en.wikipedia.org/wiki/w/api.php?action=query&titles=";
  url += actor; 
  url += "prop=revisions&rvprop=content";
  console.log(url);
  
  /*$.get("retrieve.php?actor=" + actor, function(data) {
    alert(data);
  });*/


  $.ajax({
    type : 'GET',
    //CHANGE
    url : 'localhost/retrieve.php',
    crossDomain : true,
    success : function(data) {
      alert(data);
    }
  });
}
