var Model = require("./Model");
var _ = require("lodash");

var Structure = module.exports = function() {
  this.mountingPlanes = [];
};

Model.extend(Structure, {
  addMountingPlane: function(mountingPlane) {
    this.mountingPlanes.push(mountingPlane);
    this.trigger("change");
  }
});
