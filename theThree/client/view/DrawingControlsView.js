var $ = require("jquery");
var _ = require("lodash");
var eventBus = require("../lib/eventBus");
var orthogonalStatus = require("../orthogonalStatus");


var DrawingControlsView = module.exports = function($el) {
  _.bindAll(this);
  this.$el = $el;

  //Listen for a button click
  this.$el.find("#ortho").click(this.toggleOrth);
  //If orthogonal statuch changes, update the button text
  orthogonalStatus.bind("change:status", this.updateButton);

};

DrawingControlsView.prototype = Object.create({
  toggleOrth: function(val) {
    orthogonalStatus.invertStatus();
  },

  updateButton: function() {
    var button = this.$el.find("#ortho");
    if (orthogonalStatus.getStatus()) {
      button.html("<u>O</u>rthogonal");
    } else {
      button.html("N<u>o</u>rmal");
    }
  },

});
