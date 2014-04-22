'use strict';

var game = require('./main/game.js');
var demo1_3D = require('./main/webgl.demo1.js');




window.addEventListener('load', function (e) {
    console.log("hjello");
    game.start('canvas', demo1_3D);
}, false)