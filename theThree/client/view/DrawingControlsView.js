var $ = require("jquery");
var _ = require("lodash");
var eventBus = require("../lib/eventBus");
var orthogonalStatus = require("./orthogonalStatus");
var _2D3DStatus = require("./2D3DStatus");


var DrawingControlsView = module.exports = function($el) {
  _.bindAll(this);
  this.$el = $el;

  //Listen for a button click
  this.$el.find("#ortho").click(this.toggleOrth);
  //If orthogonal statuch changes, update the button text
  orthogonalStatus.bind("change:status", this.updateButton);

  //Listen for a button click
  this.$el.find("#2D3D").click(this.toggle2D3D);
  //If 2D3D status changes, update the button
  _2D3DStatus.bind("change:status", this.update2D3DButton);
};

DrawingControlsView.prototype = Object.create({

  // BUTTON : ORTHOGONAL
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

  // BUTTON : 2D3D
  toggle2D3D: function(val) {
    _2D3DStatus.invertStatus();
  },
  update2D3DButton: function() {
    var button = this.$el.find("#2D3D");
    if (_2D3DStatus.getStatus()) {
      //button.removeClass("button-outline");
      button.html("2D<b>/3D</b>");
    } else {
      //button.addClass("button-outline");
      button.html("<b>2D/</b>3D");
    }
  },

});
