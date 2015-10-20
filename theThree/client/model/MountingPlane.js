var Model = require("./Model");
var uid = require("../lib/uid");
var _ = require("lodash");

var MountingPlane = module.exports = function(name, points) {
  this.id = uid.random();
  this.name = name;
  this.points = points;
};

Model.extend(MountingPlane, {
  getLines: function() {
    var lines = [];
    for (var i = 0; i < this.points.length; i++) {

    }
  }
});

MountingPlane.fromThreeGroup = function(group) {
  var lines = [];
  var points = [];
  _.each(group.children, function(child) {
    switch (child.name) {
      case "sphere":
        points.push(child.position);
        break;
    }
  });

  var mountingPlane = new MountingPlane(group.name, points);
  return mountingPlane;
};
