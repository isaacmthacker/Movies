var searchWords = ["film)", "(TV series), play)"];
var text = "";
var splitText = "";
var json = "";
var movies = {};
var numMovies = 0;
var jsonArr = [];
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
    var stringOfMovies = "";
    var numTimes = Math.ceil(numMovies/50);
    var combinedMovieStrings = [];
    var curCnt = 0;
    for(title in movies) {
      stringOfMovies += title;
      stringOfMovies += "|";
      ++curCnt;
      if(curCnt == 50) {
        combinedMovieStrings.push(stringOfMovies);
        stringOfMovies = "";
        curCnt = 0;
      }
    }
    combinedMovieStrings.push(stringOfMovies);
    for(var i = 0; i < combinedMovieStrings.length; ++i) {
      combinedMovieStrings[i] = combinedMovieStrings[i].slice(0,combinedMovieStrings[i].length-1);
      combinedMovieStrings[i] = encodeURIComponent(combinedMovieStrings[i]).replace(/%7C/g, "|");
    }
    for(movieString in combinedMovieStrings) {
      var moviesToPass = combinedMovieStrings[movieString];
      $.post("retrieveProfitForMovie.php", {"movies" : moviesToPass}, function(data) {
        json = JSON.parse(data);
        pages = json.query.pages;
        for(p in pages) {
          var title = pages[p].title;
          var text = pages[p]["revisions"][0]["*"];
          var gross = text.match(/gross\s*=\s*\$\d+.*\d+\s+[A-z]+/);
          if(gross) gross = gross[0];
          console.log(title, gross);
          if(gross) $("body").append("<p>" + title + " " + gross + "</p>");
          else $("body").append("<p style='color:red'>" + title + " " + gross + "</p>");
        }
      });
    }

  });

    
}


//Seven Years in Tibet
//Formatting
//Look up book instead of movie

