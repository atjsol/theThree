var Model = require("./Model");
var _ = require("lodash");
var uid = require("../lib/uid");

var Structure = module.exports = function() {
  this.id = uid.incremental("ROOF");
  this.mountingPlanes = [];
};

Model.extend(Structure, {
  addMountingPlane: function(mountingPlane) {
    this.mountingPlanes.push(mountingPlane);
    this.trigger("change");
  }
});
