var searchWords = ["film)", "(TV series), play)"];
var text = "";
var splitText = "";
var json = "";
function searchActor() {
  var actor = document.getElementById("actor").value.trim().replace(/\s+/g, ' ');

  $.get("retrieve.php?actor=" + actor, function(data) {
    //$("body").append("<p>" + data + "</p>");
    json = JSON.parse(data);
    var pageId = 0;
    for(pId in json.query.pages) {
      pageId = pId; 
    }
    text = json.query.pages[pageId]["revisions"][0]["*"];
    splitText = text.split("\n");
    var filmIndex = 0;
    var referenceIndex = 0;
    for(s in splitText) {
      if(splitText[s].match(/===?Film[A-z]*=?==/)) {
        filmIndex = s;
      }
      if(splitText[s].match(/===?References=?==/)) {
        referenceIndex = s;
      }
    }
    splitText = splitText.slice(filmIndex, referenceIndex);
    for(var i = 0; i < splitText.length; ++i) {
      var matchWithSingleQuotes = splitText[i].match(/''\[\[[A-z].*\]\]''/);
      var matchWithDoubleQuotes = splitText[i].match(/"\[\[[A-z].*\]\]"/);
      if(!(matchWithSingleQuotes || matchWithDoubleQuotes)) {
        delete splitText[i];
      } else {
        if(matchWithSingleQuotes) {
          splitText[i] = matchWithSingleQuotes[0].slice(4, matchWithSingleQuotes.length-5);
        } else {
          splitText[i] = matchWithDoubleQuotes[0].slice(3, matchWithDoubleQuotes.length-4);
        }
        splitText[i] = splitText[i].split("|");
        if(splitText[i].length == 1) {
          splitText[i] = splitText[i][0];
        } else {
          splitText[i] = splitText[i][splitText[i].length-1];
        }
      }
    }
    var cnt = 0;
    for(s in splitText) {
      $("body").append("<p>" + cnt + " " + splitText[s] + "</p><br>");
      cnt += 1;
    }
    $("body").append("<p> ====BUTTS==== </p>");
  });

}


//Check formatting

//Multiple people with same name Chris Evans (actor)


