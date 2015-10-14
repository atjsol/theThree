var $ = require("jquery");
var _ = require("lodash");
var eventBus = require("../lib/eventBus");
var orthogonalStatus = require("../orthogonalStatus");


var DrawingControlsView = module.exports = function($el) {
  _.bindAll(this);
  this.$el = $el;

  
  this.$el.find("#ortho").click(this.toggleOrth);
  orthogonalStatus.bind("change:status", this.updateButton);

};

DrawingControlsView.prototype = Object.create({
  toggleOrth : function (val){
    orthogonalStatus.invertStatus();
  },

  orthographical : function (){
    if ($('#ortho').value === "true"){
      return true;
    } else {
      return false;
    }
  },
  updateButton : function (){
    var val = this.$el.find("#ortho");
    if (!orthogonalStatus.getStatus()){
      // val.value="true";
      val.html("<u>O</u>rthogonal");
    } else {
      // val.value = "false";
      val.html("N<u>o</u>rmal");
    }

  },




});

