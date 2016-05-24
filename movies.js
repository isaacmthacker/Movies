//Gets actor from Wikipedia and gets films and box office results
var numMovies = -1;
var actor = "";
var sorted = false;

function searchActor() {
  sorted = false;
  $("#results").remove();
  $("#sortButton").remove();
  $("#error").remove();
  actor = document.getElementById("actor").value.trim().replace(/\s+/g, ' ');

  $.get("retrieveMovies.php?actor=" + actor, function(data) {
    var movies = {};
    var years = [];
    if(data == "ERROR") console.log("ERROR");
    var json = JSON.parse(data);
    var pageId = 0;
    for(pId in json.query.pages) {
      pageId = pId; 
    }
    var text = json.query.pages[pageId]["revisions"][0]["*"];
    var splitText = text.split("\n");
    var films = grabFilms(splitText);
    //For debugging
   /* 
    for(f in films) {
      $("body").append("<p>" + films[f] + "</p>");
    }
    */
    
    var parsedFilms = parseFilms(films, movies, years);

    $("body").append("<table id='results'></table>");
    $("#results").append("<caption>" + actor + "</caption>");
    $("#results").append("<thead><tr><td>Year</td><td>Title</td><td>Box Office</td></tr></thead>");
    parsedFilmsArr = [];
    for(p in parsedFilms) {
      parsedFilmsArr.push(parsedFilms[p]);
    }

    for(var i = 0; i < parsedFilmsArr.length; ++i) {
      var title = parsedFilmsArr[i];
      $("#results").append("<tr id=" + mojoFriendlyString(title) + "><th>" + years[i] + "</th><th>" + title + "</th></tr>");
    }

    getBoxOfficeAmt(movies);
    var button = "<button id=sortButton onclick=sortByGross()>Sort</button>";
    document.getElementsByTagName("form")[0].innerHTML += button;

  });
    
}


//Finds section of Wiki page with just films and grabs it
function grabFilms(splitText) {
  var filmIndex = 0;
  for(var i = 0; i < splitText.length; ++i) {
    if(splitText[i].match(/===?Film[A-z]*=?==/) || splitText[i].match(/===?As actor=?==/)) {
      filmIndex = i;
    }
  }   
  var endIndex = -1;
  for(var i = splitText.length-1; i > filmIndex; --i) {
    if(splitText[i].match(/===?.*=?==/)) {
      //console.log(splitText[i]);
      endIndex = i;    
    }
  }
  //console.log(filmIndex, endIndex);
  return splitText.slice(filmIndex, endIndex);
}



//Gets results from grabFilms and parses out the film title
function parseFilms(splitText, movies, years) {
  numMovies = 1;
  for(var i = 0; i < splitText.length; ++i) {
    if(splitText[i].match(/\|\s*\d{4}/)) {
      years.push( splitText[i].match(/\d{4}/)[0] );
    }
    var matchWithSingleQuotes = splitText[i].match(/''\[\[.*[A-z].*\]\]''/);
    if(!matchWithSingleQuotes) { 
      matchWithSingleQuotes = splitText[i].match(/''\{\{.*[A-z].*\}\}''/);
    }
    var matchWithDoubleQuotes = splitText[i].match(/"\[\[.*[A-z].*\]\]"/);
    if(!matchWithDoubleQuotes) { 
      matchWithDoubleQuotes = splitText[i].match(/"\{\{.*[A-z].*\}\}"/);
      }
    var matchJustSingleQuotes = splitText[i].match(/!scope="row"\|\s*''[A-z]+.*''/);
    var matchJustDoubleQuotes = splitText[i].match(/!scope="row"\|\s*"[A-z]+.*"/);

    if(!(matchWithSingleQuotes || matchWithDoubleQuotes || matchJustSingleQuotes || matchJustDoubleQuotes)) {
        console.log("Deleted : " + splitText[i]);
        delete splitText[i];
    } else {
      if(matchWithSingleQuotes || matchWithDoubleQuotes) {
        splitText[i] = parseFilmDoubleOrSingleQuotes(splitText[i], matchWithSingleQuotes, matchWithDoubleQuotes);
      } else if(matchJustSingleQuotes) {
          splitText[i] = splitText[i].match(/''[A-z].*''/)[0].replace(/'/g, "");  
        } else {
          //matchJustDoubleQuotes
          splitText[i] = splitText[i].match(/"[A-z].*"/)[0].replace(/"/g, "");  
      }
      if(splitText[i] && splitText[i].match(/\(.*film\)/)) {
        splitText[i] = splitText[i].split("(")[0].trim();
      }
      movies[splitText[i]] = 0;
      ++numMovies;
    }
  }
  console.log(numMovies);
  console.log(years.length);
  return splitText;
}


function parseFilmDoubleOrSingleQuotes(curFilm, matchWithSingleQuotes, matchWithDoubleQuotes) {
  var returnString = "";
  if(matchWithSingleQuotes) {
    returnString = matchWithSingleQuotes[0].slice(4, matchWithSingleQuotes.length-5);
  } else {
    returnString = matchWithDoubleQuotes[0].slice(3, matchWithDoubleQuotes.length-4);
  }
  returnString = returnString.split("|");
  if(returnString.length == 1) {
    returnString = returnString[0];
  } else {
    if(returnString.includes("sortname")) {
      var title = "";
      for(var j = 0; j < returnString.length; ++j) {
        title += returnString[j];
        title += " ";
      }
      title = title.replace("sortname", "");
      title = title.replace("nolink=1", "");
      title = title.replace(/dab=.*film/, "");
      returnString = title.trim();
    } else {
      returnString = returnString[returnString.length-1];
    }
  }
  returnString = returnString.replace("sort=", "");
  returnString = returnString.replace("]]", "");
  return returnString;
}

//Converts movie title into a string to use with Box Office Mojo api
function mojoFriendlyString(title) {
   var mojotitle = title.split(" ");
   if(mojotitle[0] == "The" || mojotitle[0] == "A" || mojotitle[0]=="An") {
     mojotitle = mojotitle.slice(1,mojotitle.length);
   }
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
   mojostring = mojostring.replace(/&/g, "and");
   mojostring = mojostring.replace(/<\s*br\s*>/g, "");
   mojostring = mojostring.replace(/<\s*br\s*\/>/g, "");
   mojostring = mojostring.replace(/:/g, "");
   return mojostring;
}


//Gets box office amount from Box Office Mojo
function getBoxOfficeAmt(movies) {
 for(title in movies) {
   $.get("retrieveProfitForMovie.php?movie=" + mojoFriendlyString(title) + "&title=" + encodeURIComponent(title), function(data) {
     parts = data.split("|");
     var title = parts[0];
     var gross = parts[1].match(/\$\d*,*\d*,*\d*,*\d*/);
     var id = mojoFriendlyString(title);
     if(gross) $("#" + id).append("<td>" + gross + "</td>");
     else $("#" + id).append("<td style='color:red'>No Results</td>");
   });
 }
}


function sortByGross() {
  var movieArr = [];
  var trArr = $("#results tr").toArray();
  finishedLoading = true;
  for(t in trArr) {
    if(trArr[t].cells.length != 3) {
      finishedLoading = false;
      break;
    }
  }
  if(!finishedLoading && !sorted) {
    $("#error").remove();
    var errorMessage = "<p id='error' style='color:red'>";
    errorMessage += "Please wait until the table has finished loading";
    errorMessage += "</p>";
    $("form").append(errorMessage);
  } else {
    $("#error").remove();
    for(var i = 1; i < trArr.length; ++i) {
      var cellArr = trArr[i].cells;
      var gross = cellArr[2].innerHTML;
      var grossStr = gross;
      gross = gross.replace("$", "");
      gross = gross.replace(/,/g, "");
      if(gross !== "No Results") gross = parseInt(gross);
      else gross = 0;
      movieArr.push({"id" : trArr[i].id, "num" : cellArr[0].innerHTML, "title" : cellArr[1].innerHTML, "gross" : gross, "grossString" : grossStr});
    }
    movieArr.sort(function(a,b) { return a.gross - b.gross; });
    movieArr = movieArr.reverse();
    $("#results").remove();
    $("body").append("<table id='results'></table>");
    $("#results").append("<caption>" + actor + "</caption>");
    $("#results").append("<thead><tr><td>#</td><td>Title</td><td>Box Office</td></tr></thead>");
    for(var i = 0; i < movieArr.length; ++i) {
      var movie = movieArr[i];
      var movieString = "<tr id=" + movie.id + "><th>" + movie.num + "</th>";
      movieString += "<th>" + movie.title + "</th><tr>";
      $("#results").append(movieString);
     if(movie.grossString != "No Results") $("#" + movie.id).append("<td>" + movie.grossString + "</td>");
     else $("#" + movie.id).append("<td style='color:red'>No Results</td>");
    }
  }
}





//change to sorts once with no error message the second time
//some movies showing up twice
//zebra stripe after sorting
//Color scheme http://colorschemedesigner.com/csd-3.5/


//Formatting
//Numbers to words
