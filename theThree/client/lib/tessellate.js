var earcut = require("earcut");
var THREE = require("three.js");

module.exports.planeGeo = function (vertices){
  //earcut takes in a flat array of points, hole vertices, and dimensions
  //earcut returns an array of indexes of triangles (every 3 points is one triangle)

  //create a face for each point
  //add vertices to a geometry 
  //add a face to the geometry
  var earcutArr = [];
  var geometry = new THREE.Geometry();
  vertices.forEach(function(val){
    geometry.vertices.push(val);
    earcutArr.push(val.x);
    earcutArr.push(val.z);
  });
  var holes = [];
  var triangles, mesh;
  var material = new THREE.MeshPhongMaterial({ color:0xffffff,side: THREE.DoubleSide });

  geometry.vertices.verticesNeedUpdate = true;
  geometry.mergeVertices();
  triangles = earcut( earcutArr, null, 2);
  for( var i = 0; i < triangles.length; i+=3 ){
    geometry.faces.push( new THREE.Face3( triangles[i], triangles[i+1], triangles[i+2]));
  }
  geometry.computeFaceNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  geometry.computeVertexNormals();

  mesh = new THREE.Mesh( geometry, material );
  mesh.name= "mounting plane shape";
  mesh.planeRotation=0;
  return mesh;
};