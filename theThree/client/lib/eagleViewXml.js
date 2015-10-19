var $ = require("jquery");
var XMLWriter = require("xml-writer");
var _ = require("lodash");

function doc() {
  return $.parseXML('<?xml version="1.0" encoding="utf-8"?><EAGLEVIEW_EXPORT xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" />');
}

function el(name) {
  return document.createElement(name);
}

function sub(parent, name) {
  var subEl = el(name);
  parent.appendChild(subEl);
  return subEl;
}

function attr(node, attrs) {
  for (var key in attrs) {
    node.setAttribute(key, attrs[key]);
  }
}

module.exports = {
  toXml: function(job) {
    var XML = doc();
    var eagleViewExport = XML.documentElement;
    attr(eagleViewExport, {
      "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
    });
    var report = sub(eagleViewExport, "report");

    return XML.outerHtml;
  },


  toXml2: function(job) {
    var xw = new XMLWriter();
    xw.startDocument();
    xw.startElement("EAGLEVIEW_EXPORT");
    xw.writeAttribute("xmlns:xsi", "ttp://www.w3.org/2001/XMLSchema-instance");

    // <REPORT claimId="South San Francisco  JB-9412729-00" reportId="11723597" />
    xw.startElement("REPORT");
    xw.writeAttribute("claimId", job.clamId);
    xw.writeAttribute("reportId", job.reportId);
    xw.endElement();

    // <VERSION coplanarity="" dormers="" precision="0" precisionUnits="" sourceVersion="1028" targetVersion="0" triangulation="" />
    xw.startElement("VERSION");
    xw.writeAttribute("coplanarity", "");
    xw.writeAttribute("dormers", "");
    xw.writeAttribute("precision", "0");
    xw.writeAttribute("precisionUnits", "");
    xw.writeAttribute("sourceVersion", "");
    xw.writeAttribute("targetVersion", "");
    xw.writeAttribute("triangulation", "");
    xw.endElement();

    //<LOCATION address="142 Robinhood Dr" city="San Francisco" lat="37.7365346" long="-122.4557854" postal="94127" state="CA" />
    xw.startElement("LOCATION");
    xw.writeAttribute("address", _.get("job.location.address"));
    xw.writeAttribute("city", _.get("job.location.city"));
    xw.writeAttribute("lat", _.get("job.location.latitude"));
    xw.writeAttribute("long", _.get("job.location.longitude"));
    xw.writeAttribute("postal", _.get("job.location.zip"));
    xw.writeAttribute("state", _.get("job.location.state"));
    xw.endElement();

    /*
     <STRUCTURES northorientation="270">
        <ROOF id="ROOF1">
          <FACES>
            <FACE designator="G" id="F1" type="ROOF" children="F9,F10">
              <POLYGON id="P1" orientation="180.5" path="L3,L4,L5,L1" pitch="2" size="363" unroundedsize="363.473486768" />
    */
    xw.startElement("STRUCTURES");
    xw.writeAttribute("northorientation", job.northOrientationDegrees);
    _.each(job.structures, function(structure) {
      xw.startElement("ROOF");
      xw.writeAttribute("id", structure.id);
      xw.startElement("FACES");
      _.each(structure.mountingPlanes, function(mountingPlane) {
        xw.startElement("FACE");
        xw.writeAttribute("designator", "?");
        xw.writeAttribute("id", mountingPlane.id);
        xw.writeAttribute("type", "ROOF");
        xw.writeAttribute("children", "???");

        xw.writeAttribute("path", mountingPlane.points.toString());

        xw.endElement();
      });

    });

    xw.endDocument();
    return xw.toString();
  }
};
