var Model = require("./Model");
var Structure = require("./Structure");
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
  }
});
