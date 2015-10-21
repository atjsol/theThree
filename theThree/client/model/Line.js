var uid = require("../lib/uid");

var Line = function(from, to) {
  this.id = uid.random();
  this.from = from;
  this.to = to;
};
module.exports = Line;
