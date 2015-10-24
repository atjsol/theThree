var THREE = require("three.js");
var util = require("./util");
var Line = require("../model/Line");

module.exports.makeLine = function makeLine(fromPoint, toPoint, radius) {
  radius = radius || 0.35;
  //CylinderGeometry args (radius top, radius bottom, height, radius segments, height segments, openeded, theta start, theta length)

  //calculate the distance
  var distance = fromPoint.distanceTo(toPoint);

  //create cylinder based onlength 
  var geometry = new THREE.CylinderGeometry(0.35, 0.35, distance, 32);
  geometry.dynamic=true;
  var material = new THREE.MeshBasicMaterial({
    color: 0xff0022
  });
  var cylinder = new THREE.Mesh(geometry, material);
  cylinder.name = "cylinder";

  //create a line to get the mid point via function
  var line = new THREE.Line3(fromPoint, new THREE.Vector3(toPoint.x, 20, toPoint.z));
  var mid = line.center();

  //Move the cylinder to the calculated mid position because that is the point where the object will pivot
  cylinder.position.x = mid.x;
  cylinder.position.y = mid.y;
  cylinder.position.z = mid.z;

  //Set the cylinder to look from one point to the next point
  //the 20000000000 helps to flatten the line to point from on point to another for some reason.  I do not understand this, but it works.
  cylinder.lookAt(new THREE.Vector3(fromPoint.x, 10000000000, fromPoint.z));
  
  cylinder.constructionData = new Line( fromPoint, toPoint );

  //return the line so that it can be used by whoever called it.
  //can immediately be added to scene or group
  return cylinder;
};

module.exports.makeSphere = function makeSphere(point, size, materialArgs)
{
  //Add the sphere to the scene to be visible representation of what we have in our queue
  size = size || 0.5;
  materialArgs = materialArgs || { color: 0xffff00 };

  var geometry = new THREE.SphereGeometry(size, 32, 32);
  geometry.dynamic=true;
  var material = new THREE.MeshBasicMaterial(materialArgs);

  var sphere = new THREE.Mesh(geometry, material);
  sphere.name = "sphere";

  sphere.position = point;
  sphere.updateMatrix();
  sphere.updateMatrixWorld();
  sphere.matrixWorldNeedsUpdate = true;
  sphere.matrixWorldNeedsUpdate = true;
  sphere.geometry.verticesNeedUpdate = true;
  sphere.geometry.elementsNeedUpdate = true;
  sphere.geometry.groupsNeedUpdate = true;
  sphere.geometry.lineDistancesNeedUpdate = true;
  sphere.geometry.normalsNeedUpdate = true;
  console.log(sphere);
  return sphere;
};

// sphereArgs = [[size, materialArgs],[size, materialArgs]...] accepts any number of spheres
module.exports.sphere = function sphere(point, sphereArgs) {

  sphereArgs = sphereArgs || [[undefined, undefined], [3, { transparent: true, opacity: 0.25 }]];
  var makeSphere = module.exports.makeSphere;

  var tbr = makeSphere(point);
  sphereArgs.forEach(function (sphereArg, i) {
   if (i !== 0) {
       var newSphere = makeSphere(new THREE.Vector3(0, 0, 0), sphereArg[0], sphereArg[1]);
       newSphere.name = "sphereChild";
       tbr.add(newSphere);
   }
  });

  return tbr;
};

//this function will take in 3 points, start, fulcrum, end and return a vector that is either + 90, 180 or 270 from the vector produced from start and fulcrum  
module.exports.snapOrth = function snapOrth(start, fulcrum, end) {
  //get vector from start fulcrum
  var line1 = start.clone().sub(fulcrum);

  //get vector from fulcrum and end
  var line2 = end.clone().sub(fulcrum);

  // use cross product to get clockwise or ccw direction to modify angle calculation
  var cross = line1.clone();
  cross.cross(line2);

  // compare the two vectors 
  var angle = line1.angleTo(line2);

  var compAngle = util.toDeg(angle);

  var modAngle;
  //create a ruleset for which angle to use
  for (var i = 0; i < 181; i += 45) {
    if (compAngle > i - 45 / 2 && compAngle < i + 45 / 2) {
      if (cross.y < 0) {
        modAngle = util.toRad(compAngle) - util.toRad(i);
      } else {
        modAngle = util.toRad(i) - util.toRad(compAngle);
      }
    }
  }

  // axis - normalized vector3
  // angle - angle in radians
  //set the axis to rotate about
  var axis = new THREE.Vector3(0, 1, 0);
  line2.applyAxisAngle(axis, modAngle);
  //add the fulcrum back in 
  line2.add(fulcrum);
  return line2;
};


module.exports.addShape = function addShape(shape, extrudeSettings, color, x, y, z, rx, ry, rz, s) {

  var points = shape.createPointsGeometry();
  var spacedPoints = shape.createSpacedPointsGeometry(50);
  // var group = new THREE.Group();

  // flat shape with texture
  // note: default UVs generated by ShapeGemoetry are simply the x- and y-coordinates of the vertices

  // var geometry = new THREE.ShapeGeometry( shape );

  // var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { side: THREE.DoubleSide} ) );
  // mesh.position.set( x, y, z  );
  // mesh.rotation.set( rx, ry, rz );
  // mesh.scale.set( s, s, s );
  // group.add( mesh );

  // // flat shape

  var geometry = new THREE.ShapeGeometry( shape );
  geometry.dynamic=true;

  var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { wireframe:false, color: color, side: THREE.DoubleSide } ) );
  mesh.position.set( x, y, z);
  mesh.rotation.set( rx, ry, rz );
  mesh.scale.set( s, s, s );
  mesh.planeRotation=0;

  // var group = new THREE.Group();
  // group.add( mesh );

  // 3d shape

  // var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  // var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
  //   color: color
  // }));
  // mesh.position.set(x, y, z);
  // mesh.rotation.set(rx, ry, rz);
  // mesh.scale.set(s, s, s);
  // mesh.planeRotation=0;

  // group.add(mesh);

  //   console.log(group);

  // solid line

  // var line = new THREE.Line( points, new THREE.LineBasicMaterial( { color: color, linewidth: 3 } ) );
  // line.position.set( x, y, z - 25 );
  // line.rotation.set( rx, ry, rz );
  // line.scale.set( s, s, s );
  // group.add( line );

  // // vertices from real points

  // var pgeo = points.clone();
  // var particles = new THREE.PointCloud( pgeo, new THREE.PointCloudMaterial( { color: color, size: 4 } ) );
  // particles.position.set( x, y, z + 25 );
  // particles.rotation.set( rx, ry, rz );
  // particles.scale.set( s, s, s );
  // group.add( particles );

  // line from equidistance sampled points

  // var line = new THREE.Line( spacedPoints, new THREE.LineBasicMaterial( { color: color, linewidth: 3 } ) );
  // line.position.set( x, y, z + 75 );
  // line.rotation.set( rx, ry, rz );
  // line.scale.set( s, s, s );
  // group.add( line );

  // equidistance sampled points

  // var pgeo = spacedPoints.clone();
  // var particles2 = new THREE.PointCloud( pgeo, new THREE.PointCloudMaterial( { color: color, size: 4 } ) );
  // particles2.position.set( x, y, z + 125 );
  // particles2.rotation.set( rx, ry, rz );
  // particles2.scale.set( s, s, s );
  // group.add( particles2 );
  return mesh;
};
