var Structure = require("./Structure");

var Job = module.exports = function(id, name, claimId, reportId) {
  this.id = id;
  this.name = name;
  this.claimId = claimId;
  this.reportId = reportId;

  this.structures = [];
};

Job.prototype = Object.create({
  setLocation: function(location) {
    this.location = location;
  },

  addStructure: function() {
    var structure = new Structure();
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
