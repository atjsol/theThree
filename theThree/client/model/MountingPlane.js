var Model = require("./Model");
var uid = require("../lib/uid");
var _ = require("lodash");
var Line = require("./Line");
var Point = require("./Point");

var MountingPlane = function(name, points, lines) {
  this.id = uid.incremental("P");
  this.faceId = uid.incremental("F");
  this.name = name;
  this.points = points;
  this.lines = lines || this.generateLines();
};
module.exports = MountingPlane;

Model.extend(MountingPlane, {
  generateLines: function() {
    var lines = [];
    for (var i = 0; i < this.points.length; i++) {
      var from = this.points[i];
      var to = i < this.points.length - 1 ? this.points[i + 1] : this.points[0];
      lines.push(new Line(from, to));
    }
    return lines;
  },

  getLines: function() {
    return this.lines;
  },

  calculateAzimuth: function(){

  },

  updateFromThreeGroup: function(group) {
    var temp = MountingPlane.fromThreeGroup(group);
    this.points = temp.points;
    this.lines = temp.lines;
  }

});

MountingPlane.fromThreeGroup = function(group) {
  var points = [];
  var lines = [];
  _.each(group.children, function(child) {
    switch (child.name) {
      case "sphere":{
        points.push(child.position);
        if (!child.position.id) {
          child.position.id = uid.incremental("C");
        }
        break;

      }
      case "cylinder": {
        lines.push(child);
        break;
      }
    }
  });

  var mountingPlane = new MountingPlane(group.name, points); 
  _.each(mountingPlane.lines, function(line, i) {
    line.type = lines[i].constructionData.type;
  });
  return mountingPlane;
};
