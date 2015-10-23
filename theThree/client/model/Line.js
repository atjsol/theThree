var uid = require("../lib/uid");
var Model = require("./Model");

var Line = function(from, to, type) {
  this.id = uid.incremental("L");
  this.from = from;
  this.to = to;
  this.type = type || "other"; // type can be rake, eave, ridge, etc.
};
module.exports = Line;

Model.extend(Line, {
  getTypeUpper: function() {
    return typeof this.type === "string" ? this.type.toUpperCase() : this.type;
  }
});
