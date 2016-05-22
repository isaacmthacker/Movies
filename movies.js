var searchWords = ["film)", "(TV series), play)"];
var splitText = "";
var json = "";
function searchActor() {
  var actor = document.getElementById("actor").value.trim().split(" ");

  $.get("retrieve.php?firstName=" + actor[0] + "&lastName=" + actor[1], function(data) {
    json = JSON.parse(data);
    var pageId = 0;
    for(pId in json.query.pages) {
      pageId = pId; 
    }
    var text = json.query.pages[pageId]["revisions"][0]["*"];
    splitText = text.split("\n");
    //splitText = splitText.filter(containsTypeOfFilm);
    for(s in splitText) {
      //var title = splitText[s].split("|");
      //splitText[s] = title[title.length-1];
    }
    for(s in splitText) {
      $("body").append("<p>" + s + " " + splitText[s] + "</p><br>");
    }
  });

}


//Catch non-linked titles

//Check if actor has separate page or in bio page

//Check formatting

//Robert De Niro

//List of Tom Hanks' performances
//Morgan Freeman on screen and stage
//Have entering of wikipedia page


function containsTypeOfFilm(data) {
  if(data.includes('!scope=')) {
    if(data.includes("[[") && data.includes("]]")) return true;
    if(data.includes("{{") && data.includes("sortname") && data.includes("}}")) return true;
    for(s in searchWords) { 
      if(data.includes(searchWords[s])) return true;
    }
  }
  return false;
}
