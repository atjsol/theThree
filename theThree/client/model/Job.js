var Model = require("./Model");
var Structure = require("./Structure");
var MountingPlane = require("./MountingPlane");
var _ = require("lodash");

var Job = module.exports = function(id, name, claimId, reportId) {
  this.id = id;
  this.name = name;
  this.claimId = claimId;
  this.reportId = reportId;

  this.structures = [];
};

Model.extend(Job, {
  setLocation: function(location) {
    this.location = location;
  },

  addStructure: function() {
    var structure = new Structure();
    structure.bind("change", this.trigger.bind(this, "change"));
    return structure;
  },

  getStructure: function(index) {
    index = index || 0;
    if (!this.structures[index]) {
      this.structures[index] = this.addStructure();
    }
    return this.structures[index];
  },

  rebuild: function(scene) {
    var structure = this.getStructure(0);
    structure.reset();
    scene.children.forEach(function(child) {
      if (child.type === "Group" && child.name !== "grid") {
        var mountingPlane = MountingPlane.fromThreeGroup(child);
        structure.addMountingPlane(mountingPlane);
      }
    });
    this.trigger("change");
  }
});
