var $ = require("jquery");
require("jquery-ui");
var MapControlsView = require("./view/MapControlsView");
var TracingView = require("./view/TracingView");
var DrawingControlsView = require("./view/DrawingControlsView");
var Job = require("./model/Job");
var jsonStore = require("./lib/jsonStore");
var uid = require("./lib/uid");
var _ = require("lodash");


$(function() {
  $("#tabs").tabs();

  var jobId = jobId || uid.random();

  jsonStore.get(jobId).then(function(jobJson) {
    return Job.fromJSON(jobJson);
  }).catch(function(error) {
    // Could not load job with that id, create a new one.
    return new Job(jobId);
  }).then(function(job) {

    job.bind("change", _.debounce(function() {
      jsonStore.put(jobId, job);
    }, 250));

    var mapControlsView = new MapControlsView($("#mapData"));
    var drawingControlsView = new DrawingControlsView($("#drawing-controls"));
    // var tracingView = new TracingView($("#three-view"));
    window.tracingView = new TracingView($("#three-view"), job);

    mapControlsView.handleFormChange();
  });
});
