var libtess = require("libtess");
var earcut = require("earcut");
var tessy = (function initTesselator() {
  // function called for each vertex of tesselator output
  function vertexCallback(data, polyVertArray) {
    // console.log(data[0], data[1]);
    polyVertArray[polyVertArray.length] = data[0];
    polyVertArray[polyVertArray.length] = data[1];
  }
  function begincallback(type) {
    if (type !== libtess.primitiveType.GL_TRIANGLES) {
      console.log('expected TRIANGLES but got type: ' + type);
    }
  }
  function errorcallback(errno) {
    console.log('error callback');
    console.log('error number: ' + errno);
  }
  // callback for when segments intersect and must be split
  function combinecallback(coords, data, weight) {
    // console.log('combine callback');
    return [coords[0], coords[1], coords[2]];
  }
  function edgeCallback(flag) {
    // don't really care about the flag, but need no-strip/no-fan behavior
    // console.log('edge flag: ' + flag);
  }

  var tessy = new libtess.GluTesselator();
  tessy.gluTessProperty(libtess.gluEnum.GLU_TESS_WINDING_RULE, libtess.windingRule.GLU_TESS_WINDING_POSITIVE);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, vertexCallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN, begincallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, errorcallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, combinecallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, edgeCallback);

  return tessy;
})();
function triangulate(contours) {
  // libtess will take 3d verts and flatten to a plane for tesselation
  // since only doing 2d tesselation here, provide z=1 normal to skip
  // iterating over verts only to get the same answer.
  // comment out to test normal-generation code
  
  tessy.gluTessNormal(0, 0, 1);

  var triangleVerts = [];
  tessy.gluTessBeginPolygon(triangleVerts);


  for (var i = 0; i < contours.length; i++) {
    tessy.gluTessBeginContour();
    var contour = contours[i];
    for (var j = 0; j < contour.length; j += 3) {
      console.log("inserting vertices");
      var coords = [contour[j], contour[j + 1], contour[j+2]];
      tessy.gluTessVertex(coords,coords);
    }
    tessy.gluTessEndContour();
  }

  // finish polygon (and time triangulation process)
  // var startTime = window.nowish();
  tessy.gluTessEndPolygon();
  // var endTime = window.nowish();
  // console.log('tesselation time: ' + (endTime - startTime).toFixed(2) + 'ms');
  return triangleVerts;
}

(function () {
  var expect = chai.expect;
  var should = chai.should();
  var assert = chai.assert; 
 
    
  describe("Libtess", function() {
    describe("triangulation", function (){
      var num = 9
      var vertices =[[1,1,20, 1,3,20, 4,1,20, 4,3,20]];
      // for (var i=0; i < num; i++){
      //   vertices.push(Math.random(10));

      // }
      console.log(earcut(vertices));
      console.log(triangulate(vertices));      
      // function scaleTest(value, index){
      //   it("Should calculate the same meters per pixel as a supplied chart", function (){
      //     expect(value).to.equal(getScale(index));
      //   });
      // }

    });
  });
  console.log(tessy);

  
}());