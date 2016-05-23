var searchWords = ["film)", "(TV series), play)"];
var text = "";
var splitText = "";
var json = "";
var movies = {};
var numMovies = 0;
var jsonArr = [];
var ret = [];
var grosses = [];
function searchActor() {
  var actor = document.getElementById("actor").value.trim().replace(/\s+/g, ' ');

  $.get("retrieveMovies.php?actor=" + actor, function(data) {
    //$("body").append("<p>" + data + "</p>");
    if(data == "ERROR") console.log("ERROR");
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
      var matchWithSingleQuotes = splitText[i].match(/''\[\[.*[A-z].*\]\]''/);
      var matchWithDoubleQuotes = splitText[i].match(/"\[\[.*[A-z].*\]\]"/);
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
        movies[splitText[i]] = 0;
        ++numMovies;
      }
    }

    var numMovies = 0;
    $("body").append("<table id='results' border='1px'></table>");
    $("#results").append("<caption>" + actor + "</caption>");
    for(s in splitText) {
      $("#results").append("<tr><th>" + numMovies + "</th><th>" + splitText[s] + "</th></tr>");
      numMovies += 1;
    }

    for(title in movies) {
      //make function
      var mojotitle = title.split(" ");
      var mojostring = "";
      for(var i = 0; i < mojotitle.length; ++i) {
        mojostring += mojotitle[i].toLowerCase();
      }
      var filterChars = ['"', "'", "`", ",", "!", "-", "_"];
      for(var i = 0; i < filterChars.length; ++i) {
        var re = new RegExp(filterChars[i], "g");
        mojostring = mojostring.replace(re, "");
      }
      mojostring = mojostring.replace(/\?/g, "");
      mojostring = mojostring.replace(/\+/g, "");
      mojostring = mojostring.replace(/\./g, "");
      mojostring = mojostring.replace("&", "and");
      console.log(mojostring);
      $.get("retrieveProfitForMovie.php?movie=" + mojostring + "&title=" + encodeURIComponent(title), function(data) {
        ret.push(data);
        parts = data.split("|");
        //console.log(parts);
        var title = parts[0];
        var gross = parts[1].match(/\$\d*,*\d*,*\d*,*\d*/);
        //console.log(gross);
        if(gross) $("body").append("<p>" + title + " " + gross + "</p>");
        else $("body").append("<p style='color:red'>" + title + " " + gross + "</p>");
        if(!gross) gross = "0";
        else gross = gross[0];
        gross = gross.replace("$", "");
        gross = gross.replace(/,/g, "");
        grosses.push({title : gross});


      });
    }

  });

    
}


//Seven Years in Tibet
//Formatting
//Look up book instead of movie
//Numbers to words
//Ampersand -> and
//Filter A, The
//Check numbers, twelveyearsaslave and happyfeet2
//filter out tv shows better
