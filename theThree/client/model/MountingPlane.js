var Model = require("./Model");
var uid = require("../lib/uid");
var _ = require("lodash");

var MountingPlane = module.exports = function(name, points) {
  this.id = uid.random();
  this.name = name;
  this.points = points;
};

Model.extend(MountingPlane, {

});

MountingPlane.fromThreeGroup = function(group) {
  var lines = [];
  var points = [];
  _.each(group.children, function(child) {
    switch (child.name) {
      case "mounting plane shape":
        break;
      case "cylinder":
        lines.push(child);
        break;
      case "sphere":
        points.push(child.position);
        break;
    }
  });

  console.table(points);

  var mountingPlane = new MountingPlane(group.name, points);
  return mountingPlane;
};
