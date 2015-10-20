var XMLWriter = require("xml-writer");
var _ = require("lodash");
var util = require("util");

module.exports = {
  toXml: function(job) {
    var xw = new XMLWriter();
    xw.startDocument();
    xw.startElement("EAGLEVIEW_EXPORT");
    xw.writeAttribute("xmlns:xsi", "ttp://www.w3.org/2001/XMLSchaaaaaema-instance");

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
    _.each(job.structures, buildRoofElement(xw));

    xw.endDocument();
    return xw.toString();
  }
};

function buildRoofElement(xw) {
  return function(structure) {
    xw.startElement("ROOF");
    xw.writeAttribute("id", structure.id);

    buildFaces(xw, structure);
    buildLines(xw, structure);
    buildPoints(xw, structure);
  };
}


function buildFaces(xw, structure) {
  xw.startElement("FACES");
  _.each(structure.mountingPlanes, function(mountingPlane) {
    xw.startElement("FACE");
    xw.writeAttribute("designator", "?");
    xw.writeAttribute("id", mountingPlane.id);
    xw.writeAttribute("type", "ROOF");
    xw.writeAttribute("children", "???");

    xw.writeAttribute("path", "???");

    xw.endElement();
  });
  xw.endElement();
}


function buildLines(xw, structure) {
  xw.startElement("LINES");
  xw.endElement();
}

function buildPoints(xw, structure) {
  xw.startElement("POINTS");
  var pointCounter = 0;
  _.each(structure.mountingPlanes, function(mountingPlane) {
    _.each(mountingPlane.points, function(point) {
      xw.startElement("POINT");
      xw.writeAttribute("id", "C" + pointCounter++);
      xw.writeAttribute("data", pointToString(point));
      xw.endElement();
    });
  });
  xw.endElement();
}

function pointToString(point) {
  var p = 9;
  return point.x.toFixed(p) + "," + point.y.toFixed(p) + "," + point.z.toFixed(p);
}
