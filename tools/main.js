'use strict';
/*jshint browser: true */

require('hyperwatch')({
    mini: {
          position: 'bottom left'
        , size: '0x0'
        , fontSize: 0 
      }
    }
  , function () { 
    console.log('terminal have been initialized');
  }
);

var domready = require('domready');

domready(function () {
  $(".hyperwatch-full").prependTo("#hyperwatch");
  $(".hyperwatch-full").css({
    "display": "block",
    "right": "auto",
    "z-index": 0,
    "width": "auto",
    "margin": "0",
    "top": "0px",
    "position": "relative",
    "max-height": "300px"
  })
  $(".hyperwatch-mini").remove()

  if (window.location.search) {
    var EXT = decodeURIComponent(window.location.search.match(/(\?|&)ext\=([^&]*)/)[2])
    $('#EXT-Name').text(EXT)
  } else {
    $('#EXT-Name').text("Error!")
  }
});
