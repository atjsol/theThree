var $ = require("jquery");
require("jquery-ui");
var MapControlsView = require("./view/MapControlsView");
var TracingView = require("./view/TracingView");
var DrawingControlsView = require("./view/DrawingControlsView");
var ExportView = require("./view/ExportView");
var Job = require("./model/Job");
var jsonStore = require("./lib/jsonStore");
var uid = require("./lib/uid");
var _ = require("lodash");
var eventBus = require("./lib/eventBus");

$(function() {
  $("#tabs").tabs();

  var jobId = jobId || "1234567";
  var job = new Job(jobId);

  window.tracingView = new TracingView($("#three-view"), job);
  eventBus.bind("change:scene", function() {
    job.rebuild(window.tracingView.scene);
  });

  var mapControlsView = new MapControlsView($("#mapData"));
  console.log(mapControlsView);
  window.drawingControlsView = new DrawingControlsView($("#drawing-controls"));
  var exportView = new ExportView($("#export-view"), job);

  mapControlsView.handleFormChange();
});
