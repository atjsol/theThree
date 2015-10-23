var eagleViewXml = require("../../client/lib/eagleViewXml");
var Job = require("../../client/model/Job");
var MountingPlane = require("../../client/model/MountingPlane");
var xml2js = require("xml2js");

exports.testEmptyXml = function(test) {
    var job = new Job("1234", "Purely Testing");
    var xmlString = eagleViewXml.toXml(job);
    test.ok(xmlString);
    xml2js.parseString(xmlString, function(error, result) {
        test.ifError(error);
        test.ok(result);
        test.ok(result.EAGLEVIEW_EXPORT);
        test.ok(result.EAGLEVIEW_EXPORT.STRUCTURES);
        test.ok(result.EAGLEVIEW_EXPORT.STRUCTURES);
        test.ok(result.EAGLEVIEW_EXPORT.STRUCTURES[0]);

        test.done();
    });
};