var MicroEvent = require("microevent");
var _ = require("lodash");

var Model = module.exports = function() {

};

Model.prototype = Object.create({
  toJSON: function() {
    return _.omit(this, "_events");
  }
});

MicroEvent.mixin(Model);

Model.extend = function(clazz, stuff) {
  clazz.prototype = Object.create(Model.prototype);
  _.extend(clazz.prototype, stuff);
};
