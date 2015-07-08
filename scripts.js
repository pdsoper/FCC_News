// scripts.js for freeCodeCamp "Zipline" exercise

$(document).ready(function() {

/* If we use createDivs here, masonry works - layout and spacing are correct
At least that is the case with masonry initialization in html
    <div class="grid js-masonry" 
      data-masonry-options='{ "itemSelector": ".grid-item", 
      "columWidth": 200, 
      "gutter": 10 }'>    </div>
    With neither html nor any other intializattionn, masonry does not work - no
    surprise there
    !! The initialization that works in the masonry demo (local copy) 
       does not work here.
    It would be interesting to try this with isotope instead
*/
  //createDivs(1,10);
 
  getNews();

  function createDivs(start, end) {
    for (var i = start; i <= end; i++) {
      var divId = "div" + i;
      var div = '<div class="grid-item" id="' + divId + '"><p>' + i + '</p></div>';
      $('.grid').append(div);
      $('.grid').masonry('append', div);
      divId = "#" + divId;
      var color = randomColor();
      $(divId).css("background-color", color);
      $(divId).css("color", bw(color));
      $(divId).css("height", randomInRange(100,400));
      $(divId).css("text-align", "center");
      $(divId).css("font-weight", "bold");
    };
  }

  $( window ).resize(centerGrid());

  function centerGrid() {
    var gw = Math.round($('.grid').width());
    var cw = Math.round($('.grid-item').width());
    var gutter = 10;
    var colCount = Math.floor(gw / cw);
    var used = gw - cw * colCount + gutter * (colCount - 1)
    var offset = Math.floor(used / 2);
    // console.log(gw, cw, gutter, colCount, used, offset);
    $('.grid').css("left", offset);
  };

  function getNews() {
    $.ajax({
        url: "http://www.freecodecamp.com/stories/hotStories",
        type: "GET",
    })
    .done(function(data, textStatus, jqXHR) {
      console.log("HTTP Request Succeeded: " + jqXHR.status);
      // console.log(data);
      $('#news-table').append(makeJSONTable(data, "Results of FCC news query"));
      var divStr = data
      .map(function(a) { return writeDiv(a); })
      .reduce(function(a,b) { return a + b; });
      $('.grid').append(divStr);
      $('.grid').imagesLoaded(function() {
        $('.grid').masonry({
          itemSelector: '.grid-item',
          columnWidth: 200,
          gutter: 10,
        });
        centerGrid();
      });
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      console.log("HTTP Request Failed");
      console.log(jqXHR);
      console.log(errorThrown);
    })
    .always(function() {
      //data|jqXHR, textStatus, jqXHR|errorThrown
    });
  }

  function writeDiv(obj) {
    // console.log(obj);
    var divStr = "";
    var image = obj.image;
    if (image.length === 0) {
      image = obj.author.picture;
    }
    if (image.length === 0) {
      image = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Pessoa_Neutra.svg/240px-Pessoa_Neutra.svg.png";
    }
    divStr += '<a href="' + obj.link + '" target="_blank">'
    divStr += '<div class="grid-item">\n';
    divStr += '<img src="' + image + '" />\n';
    divStr += '<p class="headline">' + titleCase(obj.headline) + '</p>\n';
    divStr += '<p class="comments">' + obj.comments.length + ' comments' + '</p>\n';
    divStr += '<p class="author">' + obj.author.username + '</p>\n';
    divStr += '</div>\n';
    divStr += '</a>';
    // console.log(divStr);
    return divStr;
  }

  function makeJSONTable(obj, heading) {
    // This creates a nested table of JSON data. Use Bootstrap, if available.  If not, use css
    var bootstrap_enabled = (typeof $().modal == 'function');
    if (!bootstrap_enabled) {
      $('table').css("border-collapse", "collapse");
      $('th, td').css("border", "1px solid black");
    }
    var tableBody = "";
    if (heading !== undefined) {
      tableBody += '<h4>' + heading + '</h4>';
    }
    tableBody += '<table class="table table-striped table-bordered">\n';
    $.each(obj, function(k, v) {
      tableBody += "<tr><td>" + k + "</td><td>";
      if (typeof v !== "object") {
        tableBody += v;
      } else {
        tableBody += makeJSONTable(v);
      }
    });
    tableBody += '</td></tr></table>';
    return tableBody; 
  }
 
   function randomInRange(min, max) {
    // Return an integer value in the range min <= value <= max
    min = Math.round(min);
    max = Math.round(max);
    return Math.floor(min + Math.random() * (max - min + 1));
  }

  function randomColor() {
      var letters = "0123456789ABCDEF".split("");
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  }

  function bw(color) {
    // Return "black" or "white", whichever has greater contrast
    if (color.length < 6 || color.length > 7) {
      console.log("Illegal color value for function bw: " + color);
      return;
    }
    if (color.length === 7) {
      color = color.slice(1)
    }
    var r = color.slice(0,2);
    var g = color.slice(2,4);
    var b = color.slice(4,6);
    var mean = (parseInt(r,16) + parseInt(g,16) + parseInt(b,16)) / 3.0;
    if (mean < 128) {
      return "white";
    } else {
      return "black";
    }
  }

  function capitalize(str) {
    if (str.length <= 1) {
      return str.toUpperCase();
    } else {
      return str[0].toUpperCase() + str.slice(1).toLowerCase();
    }
  }

  function titleCase(str) {
    return str.split(' ').map(function(a) { return capitalize(a); }).join(' ');
  }

}); 
