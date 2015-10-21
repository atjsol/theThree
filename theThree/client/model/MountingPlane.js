var Model = require("./Model");
var uid = require("../lib/uid");
var _ = require("lodash");
var Line = require("./Line");
var Point = require("./Point");

var MountingPlane = module.exports = function(name, points) {
  this.id = uid.random();
  this.name = name;
  this.points = points;
};

Model.extend(MountingPlane, {
  getLines: function() {
    var lines = [];
    for (var i = 0; i < this.points.length; i++) {
      var from = this.points[i];
      var to = i < this.points.length - 1 ? this.points[i] : this.points[i + 1];
      lines.push();
    }
  }
});

MountingPlane.fromThreeGroup = function(group) {
  var lines = [];
  var points = [];
  _.each(group.children, function(child) {
    switch (child.name) {
      case "sphere":
        points.push(new Point(child.position.x, child.position.y, child.position.z));
        break;
    }
  });

  var mountingPlane = new MountingPlane(group.name, points);
  return mountingPlane;
};
