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
    })
  }
  return newObj;
}


