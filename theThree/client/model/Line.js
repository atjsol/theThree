var uid = require("../lib/uid");

var Line = function(from, to) {
  this.id = uid.incremental("L");
  this.from = from;
  this.to = to;
};
module.exports = Line;
