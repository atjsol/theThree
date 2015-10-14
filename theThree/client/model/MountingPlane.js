var uid = require("../lib/uid");
var _ = require("lodash");

var MountingPlane = module.exports = function(id) {
  id = id || uid.random();
};

MountingPlane.prototype = Object.create({

});

MountingPlane.fromThreeGroup = function(group) {
  var mountingPlane = new MountingPlane();
  //console.table(group.children);
  _.each(group.children, function(child) {
    console.log(child.name);
    switch (child.name) {
      case "mounting plane shape":
        break;
      case "cylinder":
        break;
      case "sphere":
        break;
    }
  });
};
