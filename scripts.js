$(document).ready(function() {

  var $grid = $('.grid').masonry({
    itemSelector: '.grid-item',
    columnWidth: 200
  });

  $grid.imagesLoaded().progress(function() {
    $grid.masonry('layout');
  });
 
  getNews();

  function colorDivs() {
    for (var i = 1; i <= 12; i++) {
      var div = ".div" + i;
      var color = randomColor();
      $(div).css("background-color", color);
      $(div).css("color", bw(color));
    };
  }

  function randomColor() {
      var letters = "0123456789ABCDEF".split("");
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.round(Math.random() * 15)];
      }
      return color;
  }

  function hexToDec(hexStr) {
    if (hexStr[0] === '#') {
      return parseInt(hexStr.slice(1), 16);
    } else {
      return parseInt(hexStr, 16);
    }
  }

  function decToHex(dec) {
    return Number(dec).toString(16);
  }

  function repeatStr(str,n) {
    var ans = "";
    for (var i = 0; i < n; i++) {
      ans += str;
    };
    return ans;
  }

  function compColor(color) {
    var comp = decToHex(hexToDec("ffffff") - hexToDec(color));
    return "#" + repeatStr('0', 6 - comp.length) + comp;
  }

  function bw(color) {
    if (hexToDec(color) < hexToDec("888888")) {
      return "white";
    } else {
      return "black";
    }
  }

  function randomRgba() {
    var r = Math.floor(256 * Math.random());
    var g = Math.floor(256 * Math.random());
    var b = Math.floor(256 * Math.random());
    var a = Math.random();
    return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
  }

  function capitalize(str) {
    if (str.length === 0) {
      return str;
    } else if (str.length === 1) {
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

  function round(num, decimals) {
    var factor = Math.pow(10, decimals);
    return Math.round(factor * num) / factor; 
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

  function writePage(data) {
    data.forEach(function(a) {
      writeDiv(a);
    })
  }

  function writeData(ipData, wData) {
  }
 
  function makeJSONTable(obj, heading) {
    // This creates a nested table of JSON data 
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
