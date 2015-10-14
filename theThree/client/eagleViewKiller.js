var $ = require("jquery");
require("jquery-ui");
var MapControlsView = require("./view/MapControlsView");
var TracingView = require("./view/TracingView");
var DrawingControlsView = require("./view/DrawingControlsView");


$(function() {
  $("#tabs").tabs();
  var mapControlsView = new MapControlsView($("#mapData"));
  var drawingControlsView = new DrawingControlsView($("#drawing-controls"));
  // var tracingView = new TracingView($("#three-view"));
  window.tracingView = new TracingView($("#three-view"));


  mapControlsView.handleFormChange();
});
