// scripts.js for freeCodeCamp "Zipline" exercise

$(document).ready(function() {
 
  // Get the news using the freeCodeCamp API
  getNews();

  // Center the grid whenever the window is resized
  $( window ).resize(centerGrid());

  function getNews() {
    $.ajax({
        url: "http://www.freecodecamp.com/stories/hotStories",
        type: "GET",
    })
    .done(function(data, textStatus, jqXHR) {
      console.log("HTTP Request Succeeded: " + jqXHR.status);
      // console.log(data);
      var divStr = data
      .map(function(a) { return writeDiv(a); })
      .reduce(function(a,b) { return a + b; });
      $('.grid').append(divStr);
      $('.grid').imagesLoaded(function() {
        $('.grid').isotope({
          itemSelector: '.grid-item',
          masonry: {
            columnWidth: 200,
            gutter: 10,
          }
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

  $('.comments').click(function() {
    var id = $(this).id();
    alert(id);
  });

  function writeDiv(obj) {
    var divStr = "";
    var discussion = 'http://www.freecodecamp.com/news/' + obj.storyLink.replace(/\s+/g, '-');
    var image = obj.image;
    if (image.length === 0) {
      image = obj.author.picture;
    }
    if (image.length === 0) {
      image = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Pessoa_Neutra.svg/240px-Pessoa_Neutra.svg.png";
    }
    divStr += '<div class="grid-item">\n';
    divStr += '  <a href="' + obj.link + '" target="_blank">\n';
    divStr += '  <div class="top-div">\n';
    divStr += '    <div class="img-div">\n';
    divStr += '      <img src="' + image + '" />\n';
    divStr += '    </div>\n';
    divStr += '    <p class="headline">' + titleCase(obj.headline) + '</p>\n';
    divStr += '  </div>\n';
    divStr += '  </a>\n';
    divStr += '  <a href="' + discussion + '" target="_blank">\n';
    divStr += '  <div class="bottom-div" id="' + discussion + '">\n';
    divStr += '    <p class="comments">' + obj.comments.length + ' comments' + '</p>\n';
    divStr += '    <p class="author">' + obj.author.username + '</p>\n';
    divStr += '  </div>\n';
    divStr += '  </a>\n';
    divStr += '</div>\n';
    return divStr;
  }

  function centerGrid() {
    var gw = Math.round($('.grid').width());
    var cw = Math.round($('.grid-item').width());
    var gutter = 10;
    var colCount = Math.floor(gw / cw);
    var used = gw - cw * colCount + gutter * (colCount - 1)
    var offset = Math.floor(used / 2);
    $('.grid').css("left", offset);
  };

  function capitalize(str) {
    if (str.length === 0) {
      return str;
    } else {
      return str[0].toUpperCase() + str.slice(1).toLowerCase();
    }
  }

  function titleCase(str) {
    return str.split(' ').map(function(a) { return capitalize(a); }).join(' ');
  }

}); 
