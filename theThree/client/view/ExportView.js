var _ = require("lodash");
var eagleViewXml = require("../lib/eagleViewXml");

var ExportView = module.exports = function($el, job) {
  _.bindAll(this);
  this.$el = $el;
  this.job = job;

  this.$el.on("click", "#download-link", this.handleDownloadLinkClick);
};

ExportView.prototype = Object.create({
  handleDownloadLinkClick: function(event) {
    var anchor = event.currentTarget;
    var job = this.job;
    var jobId = job.id;

    var xml;
    try {
      xml = eagleViewXml.toXml(job);
    } catch (e) {
      alert("Sorry, something went wrong");
      console.error(e);
      return false;
    }
    var blob = new Blob([xml], {
      type: "text/xml"
    });
    var url = URL.createObjectURL(blob);
    anchor.download = "eagleview-" + jobId;
    anchor.href = url;
  }
});
