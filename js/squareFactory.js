var Square = require('./square.js');
var rand = require('./utils.js').rand;

var sf = SquareFactory;

function SquareFactory(){
    if (!(this instanceof sf)) return new sf();
}

SquareFactory.prototype.make = function(type, y, dir) {
    var y = y;
    var type = type || rand(1, 7);
    var dir = dir;

    return new Square(type, { x: 0, y: y }, dir);
}

module.exports = SquareFactory;