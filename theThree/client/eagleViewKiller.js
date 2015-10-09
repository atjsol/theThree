var $ = require("jquery");
require("jquery-ui");
var MapControlsView = require("./view/MapControlsView");
var TracingView = require("./view/TracingView");

$(function() {
  $("#tabs").tabs();

  var mapControlsView = new MapControlsView($("#mapData"));
  var tracingView = new TracingView($("#three-view"));

  mapControlsView.handleFormChange();
});
