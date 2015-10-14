var $ = require("jquery");
require("jquery-ui");
var MapControlsView = require("./view/MapControlsView");
var TracingView = require("./view/TracingView");
var Job = require("./model/Job");
var jsonStore = require("./lib/jsonStore");
var uid = require("./lib/uid");

$(function() {
  $("#tabs").tabs();

  var jobId = jobId || uid.random();

  jsonStore.get(jobId).then(function(jobJson) {
    console.debug(jobJson);

    return Job.fromJSON(jobJson);
  }).catch(function(error) {
    console.error(error);

    return new Job(jobId);

  }).then(function(job) {
    console.log("SUCCESS", job);

    var mapControlsView = new MapControlsView($("#mapData"));
    // var tracingView = new TracingView($("#three-view"));
    window.tracingView = new TracingView($("#three-view"), job);

    mapControlsView.handleFormChange();
  });
});
