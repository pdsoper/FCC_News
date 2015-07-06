$(document).ready(function() {

  var $grid = $('.grid').masonry({
    itemSelector: '.grid-item',
    columnWidth: 200
  });

  $grid.imagesLoaded().progress(function() {
    $grid.masonry('layout');
  });
 
  colorDivs();
  // getNews();

  function colorDivs() {
    for (var i = 1; i <= 12; i++) {
      var div = ".div" + i;
      var color = randomColor();
      $(div).css("background-color", color);
      $(div).css("color", bw(color));
      $(div).css("text-align", "center");
      $(div).css("font-weight", "bold");
    };
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

  function getNews() {
    $.ajax({
        url: "http://www.freecodecamp.com/stories/hotStories",
        type: "GET",
    })
    .done(function(data, textStatus, jqXHR) {
      console.log("HTTP Request Succeeded: " + jqXHR.status);
      // console.log(data);
      // $('#news').append(makeJSONTable(data, "Results of FCC news query"));
      var divStr = data
      .map(function(a) { return writeDiv(a); })
      .reduce(function(a,b) { return a + b; });
      $('.grid').append(divStr);
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
    console.log(obj);
    var divStr = '<div class="grid-item">\n';
    var image = obj.image;
    if (image.length === 0) {
      image = obj.author.picture;
    }
    if (image.length === 0) {
      image = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Pessoa_Neutra.svg/240px-Pessoa_Neutra.svg.png";
    }
    console.log("image", image);
    console.log("headline", obj.headline);
    console.log("comments", obj.comments);
    console.log("username", obj.author.username);
    divStr += '<img src="' + image + '" />\n';
    divStr += '<p class="headline">' + titleCase(obj.headline) + '</p>\n';
    divStr += '<p class="comments">' + obj.comments.length + ' comments' + '</p>\n';
    divStr += '<p class="author">' + obj.author.username + '</p>\n';
    divStr += '</div>';
    console.log(divStr);
    return divStr;
  }

  function makeJSONTable(obj, heading) {
    /* This creates a nested table of JSON data. Use Bootstrap, if available. 
    If not, use css :
    table { border-collapse: collapse; }
    th, td { border: 1px solid black; }
    */
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
 
}); 
