var eagleViewXml = require("../../client/lib/eagleViewXml");
var Job = require("../../client/model/Job");
var MountingPlane = require("../../client/model/MountingPlane");
var Point = require("../../client/model/Point");
var xml2js = require("xml2js");
var parser = new xml2js.Parser({explicitArray : false});

exports.testEmptyXml = function(test) {
    var job = new Job("1234", "Purely Testing");
    var xmlString = eagleViewXml.toXml(job);
    test.ok(xmlString);
    parser.parseString(xmlString, function(error, result) {
        test.ifError(error);
        test.ok(result);
        test.ok(result.EAGLEVIEW_EXPORT);
        test.ok(result.EAGLEVIEW_EXPORT.STRUCTURES);

        test.done();
    });
};

exports.testBasicXml = function(test) {
    var job = new Job("1234", "Purely Testing");
    var structure = job.getStructure(0);
    test.ok(job);
    test.ok(structure);
    test.equals(structure, job.structures[0]);

    var mountingPlane = new MountingPlane("North Roof", [
        new Point(24, 7, 32),
        new Point(-24, 7, 32),
        new Point(-24, 7, -32),
        new Point(24, 7, -32)
    ]);
    structure.addMountingPlane(mountingPlane);

    var xmlString = eagleViewXml.toXml(job);
    test.ok(xmlString);

    parser.parseString(xmlString, function(error, result) {
        test.ifError(error);

        //console.log(JSON.stringify(result, null, "  "));

        test.ok(result);
        test.ok(result.EAGLEVIEW_EXPORT);

        var structures = result.EAGLEVIEW_EXPORT.STRUCTURES;
        test.ok(structures);
        test.equals(0, structures.$.northorientation);
        
        var roof = structures.ROOF;
        test.ok(roof);
        test.equals("ROOF1", roof.$.id);

        test.ok(roof.FACES);
        test.ok(roof.FACES.FACE);
        test.ok(roof.FACES.FACE.POLYGON);

        test.ok(roof.LINES);
        test.equals(4, roof.LINES.LINE.length);

        test.ok(roof.POINTS);
        test.equals(4, roof.POINTS.POINT.length);

        test.done();
    });
};