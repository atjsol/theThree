var THREE = require("three.js");
exports.centroid = function centriod(mesh){
  var geometry = mesh.geometry;
  geometry.centroid = new THREE.Vector3();
  for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
      geometry.centroid.addSelf( geometry.vertices[ i ].position );
  } 
  return geometry.centroid.divideScalar( geometry.vertices.length );
};

exports.toDeg = function toDeg(val) {
  return val * 180 / Math.PI;
};

exports.toRad = function toRad(degrees) {
  return degrees * Math.PI / 180;
};

exports.backwards = function backwards(array, func, that) {
  for (var i = array.length - 1; i >= 0; i--) {
    func.call(that, array[i], i, array);
  }
};

exports.convArgs = function convArgs(args){
  var argsArray = Array.prototype.slice.call(args);
  return argsArray;
};

exports.arrToObj = function arrToObj (array, useIndex){
  var newObj = {};
  if (useIndex){
    array.forEach(function (value, index, arr){
      newObj[index]=value;
    });
  } else {
    array.forEach(function (value, index, arr){
      newObj[value] = value;
    });
  }
  return newObj;
};

exports.getAngle = function getAngle (start, fulcrum, end){
  //get vector from start fulcrum
 
  var line1 = start.clone().sub(fulcrum);

  //get vector from fulcrum and end
  var line2 = end.clone().sub(fulcrum);

  // compare the two vectors 
  var angle = line1.angleTo(line2);

  var compAngle = exports.toDeg(angle);

  return compAngle;


};

