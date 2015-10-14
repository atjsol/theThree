var Polygon = require("./Polygon");

var Structure = module.exports = function() {
  this.polygons = [];
};

Structure.prototype = Object.create({
  getPolygon: function(polygonId) {

  },

  addPolygon: function(points) {
    this.polygons.push(new Polygon(points));
  }
});
