var $ = require("jquery");
var _ = require("lodash");
var eventBus = require("../lib/eventBus");

var MapControlsView = module.exports = function($el) {
  _.bindAll(this);
  this.$el = $el;

  $el.change(this.handleFormChange);
};

MapControlsView.prototype = Object.create({
  handleFormChange: function(val) {
    var mapObj = {};
    $('#mapData').children().each(function(val) {
      mapObj[this.name] = this.value;
    });

    eventBus.trigger("change:map", mapObj);
  }
});
