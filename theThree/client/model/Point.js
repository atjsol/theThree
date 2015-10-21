var Model = require("./Model");

var Point = module.export = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
};

Model.extend(Point, {
  toString: function() {
    var p = 9;
    return this.x.toFixed(p) + "," + this.y.toFixed(p) + "," + this.z.toFixed(p);
  }
});
