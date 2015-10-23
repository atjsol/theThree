var XMLWriter = require("xml-writer");
var _ = require("lodash");
var util = require("util");

module.exports = {
  toXml: function(job) {
    var xw = new XMLWriter();
    xw.startDocument();
    xw.startElement("EAGLEVIEW_EXPORT");
    xw.writeAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");

    // <REPORT claimId="South San Francisco  JB-9412729-00" reportId="11723597" />
    xw.startElement("REPORT");
    // xw.writeAttribute("claimId", job.clamId);
    // xw.writeAttribute("reportId", job.reportId);
    xw.endElement();

    // <VERSION coplanarity="" dormers="" precision="0" precisionUnits="" sourceVersion="1028" targetVersion="0" triangulation="" />
    xw.startElement("VERSION");
    /*xw.writeAttribute("coplanarity", "");
    xw.writeAttribute("dormers", "");
    xw.writeAttribute("precision", "0");
    xw.writeAttribute("precisionUnits", "");
    xw.writeAttribute("sourceVersion", "");
    xw.writeAttribute("targetVersion", "");
    xw.writeAttribute("triangulation", "");*/
    xw.endElement();

    //<LOCATION address="142 Robinhood Dr" city="San Francisco" lat="37.7365346" long="-122.4557854" postal="94127" state="CA" />
    xw.startElement("LOCATION");
    /*xw.writeAttribute("address", _.get("job.location.address"));
    xw.writeAttribute("city", _.get("job.location.city"));
    xw.writeAttribute("lat", _.get("job.location.latitude"));
    xw.writeAttribute("long", _.get("job.location.longitude"));
    xw.writeAttribute("postal", _.get("job.location.zip"));
    xw.writeAttribute("state", _.get("job.location.state"));*/
    xw.endElement();

    /*
     <STRUCTURES northorientation="270">
        <ROOF id="ROOF1">
          <FACES>
            <FACE designator="G" id="F1" type="ROOF" children="F9,F10">
              <POLYGON id="P1" orientation="180.5" path="L3,L4,L5,L1" pitch="2" size="363" unroundedsize="363.473486768" />
    */
    xw.startElement("STRUCTURES");
    xw.writeAttribute("northorientation", 0); //job.northOrientationDegrees);
    _.each(job.structures, buildRoofElement(xw));

    xw.endDocument();
    return xw.toString().replace(/></g, ">\n<");
  }
};

function buildRoofElement(xw) {
  return function(structure) {
    xw.startElement("ROOF");
    xw.writeAttribute("id", structure.id);

    var lines = [];
    _.each(structure.mountingPlanes, function(mountingPlane) {
      lines = lines.concat(mountingPlane.getLines());
    });

    buildFaces(xw, structure);
    buildLines(xw, lines);
    buildPoints(xw, structure);
  };
}


function buildFaces(xw, structure) {
  xw.startElement("FACES");
  _.each(structure.mountingPlanes, function(mountingPlane) {
    xw.startElement("FACE");
    xw.writeAttribute("id", mountingPlane.faceId);
    xw.writeAttribute("type", "ROOF");
    xw.writeAttribute("orientation", mountingPlane.azimuth);

    xw.startElement("POLYGON");
    xw.writeAttribute("id", mountingPlane.id);
    xw.writeAttribute("path", _(mountingPlane.getLines()).pluck("id").join(","));
    xw.endElement();

    xw.endElement();
  });
  xw.endElement();
}


function buildLines(xw, lines) {
  xw.startElement("LINES");
  _.each(lines, function(line) {
    xw.startElement("LINE");
    xw.writeAttribute("id", line.id);
    xw.writeAttribute("path", line.from.id + "," + line.to.id);
    xw.writeAttribute("type", line.getTypeUpper());
    xw.endElement();
  });
  xw.endElement();
}

function buildPoints(xw, structure) {
  xw.startElement("POINTS");
  _.each(structure.mountingPlanes, function(mountingPlane) {
    _.each(mountingPlane.points, function(point) {
      xw.startElement("POINT");
      xw.writeAttribute("id", point.id);
      xw.writeAttribute("data", pointToString(point));
      xw.endElement();
    });
  });
  xw.endElement();
}

function pointToString(point) {
  var p = 9;
  return point.x.toFixed(p) + "," + (-1 * point.z).toFixed(p) + "," + point.y.toFixed(p);
}
