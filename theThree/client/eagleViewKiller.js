var $ = require("jquery");
require("jquery-ui");
var MapControlsView = require("./view/MapControlsView");
var TracingView = require("./view/TracingView");
var DrawingControlsView = require("./view/DrawingControlsView");
var ObjectAttributeView = require("./view/ObjectAttributeView");


$(function() {
  // .tabs() and .accordion() are part of the jquery-ui library- used to activate their functionality
  $("#tabs").tabs({collapsible:true});
  // $("#object-attribute-view").accordion({
  //   collapsible:true,
  //   heightstyle:"content",
    
  // });
  var mapControlsView = new MapControlsView($("#mapData"));

  var drawingControlsView = new DrawingControlsView($("#drawing-controls"));
  // var tracingView = new TracingView($("#three-view"));
  window.tracingView = new TracingView($("#three-view"));

  mapControlsView.handleFormChange();
});
