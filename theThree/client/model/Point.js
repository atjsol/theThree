var Model = require("./Model");
var uid = require("../lib/uid");

var Point = function(x, y, z) {
  this.id = uid.incremental("C");
  this.x = x;
  this.y = y;
  this.z = z;
};
module.exports = Point;

Model.extend(Point, {
  toString: function() {
    var p = 9;
    return this.x.toFixed(p) + "," + this.y.toFixed(p) + "," + this.z.toFixed(p);
  }
});
