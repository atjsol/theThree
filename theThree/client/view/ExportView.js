var _ = require("lodash");
var eagleViewXml = require("../lib/eagleViewXml");

var ExportView = module.exports = function($el, job) {
  _.bindAll(this);
  this.$el = $el;
  this.job = job;

  this.$el.on("click", "#download-link", this.handleDownloadLinkClick);
  this.$el.on("click", "#view-link", this.handleViewLinkClick);
};

ExportView.prototype = Object.create({
  getXml: function(job) {
    var xml;
    try {
      xml = eagleViewXml.toXml(job);
    } catch (e) {
      alert("Sorry, something went wrong");
      console.error(e.stack);
      throw e;
    }
    return xml;
  },

  getXmlUrl: function(job) {
    var xml = this.getXml(job);
    var blob = new Blob([xml], {
      type: "text/xml"
    });
    return URL.createObjectURL(blob);
  },

  handleDownloadLinkClick: function(event) {
    var anchor = event.currentTarget;
    var jobId = this.job.id;

    var url = this.getXmlUrl(this.job);
    anchor.download = "eagleview-" + jobId;
    anchor.href = url;
  },

  handleViewLinkClick: function(event) {
    event.preventDefault();

    var url = this.getXmlUrl(this.job);
    window.open(url);
    return false;
  }
});
