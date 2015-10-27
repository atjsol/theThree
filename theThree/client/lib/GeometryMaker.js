var THREE = require("three.js");
var util = require("./util");
var extrudeSettings = require("./extrudeSettings");
var eventBus = require("../lib/eventBus");
var uid = require("../lib/uid");
var _ = require("lodash");


module.exports.makeLine = function makeLine(fromPoint, toPoint, radius) {
  radius = radius || 0.35;
  //CylinderGeometry args (radius top, radius bottom, height, radius segments, height segments, openeded, theta start, theta length)
  //var lookatVector = toPoint.clone().sub(fromPoint.clone());

  // direction vector
  var direction = new THREE.Vector3().subVectors(toPoint.clone(), fromPoint.clone());

  var helperPoint;
  if (Math.abs(toPoint.y - fromPoint.y) > 1) {
        helperPoint = new THREE.Vector3(fromPoint.x, toPoint.y, fromPoint.z);
        //helperdirection = new THREE.Vector3().subVectors(helperPoint.clone(), fromPoint.clone());
    }
    else {
        helperPoint = new THREE.Vector3(fromPoint.x, fromPoint.y + 1000000, fromPoint.z);
    }

  var helperdirection = new THREE.Vector3().subVectors(helperPoint.clone(), fromPoint.clone());
  var cross1 = direction.clone().cross(helperdirection.clone());
  var cross2 = fromPoint.clone().add(cross1.clone().cross(direction.clone()));

  //calculate the distance
  var distance = fromPoint.clone().distanceTo(toPoint.clone());

  //create cylinder based onlength
  var geometry = new THREE.CylinderGeometry(0.35, 0.35, distance, 32);
  geometry.dynamic = true;

  var material = new THREE.MeshBasicMaterial({
    color: 0xff0022
  });
  var cylinder = new THREE.Mesh(geometry, material);
  cylinder.name = "cylinder";

  //create a line to get the mid point via function
  var line = new THREE.Line3(fromPoint, toPoint); //new THREE.Vector3(toPoint.x, 20, toPoint.z));
  var mid = line.center();

  //Move the cylinder to the calculated mid position because that is the point where the object will pivot
  cylinder.position.x = mid.x;
  cylinder.position.y = mid.y;
  cylinder.position.z = mid.z;

  //Set the cylinder to look from one point to the next point
    //the 20000000000 helps to flatten the line to point from on point to another for some reason.  I do not understand this, but it works
  cylinder.lookAt(cross2); //toPoint.x, 10000000000, toPoint.z));


  cylinder.constructionData = {
    points: [ fromPoint, toPoint ]
  };

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

  sphere.position.set(point.x, point.y, point.z);

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

module.exports.buildGroup = function buildGroup(group, shapeQue){
  shapeQue = shapeQue || [];
  group = group || new THREE.Group();
  var newChildren = [];
  var newOutline = new THREE.Shape();
  function addToOutline(point, i, array) {
    if (i === 0) {
      newOutline.moveTo(point.x, point.z);
    } else {
      newOutline.lineTo(point.x, point.z);
    }
  }
  if (shapeQue.length > 2){
    shapeQue.forEach(function (point, i, array){
      addToOutline(point, i);
      newChildren.push(module.exports.sphere(point));
      if (i+1 < array.length){
        newChildren.push(module.exports.makeLine(point, array[i+1]));
      } else {
        newChildren.push(module.exports.makeLine(array[0], point));
      }


    });


  } else {
    var spheres = [];
    var lines = [];

    group.children.forEach(function(child, i, array){
      if (child.name === "sphere"){
        addToOutline(child.position, i);
        spheres.push(child);
      } else if (child.name === "cylinder") {
        lines.push(child);
      }
    });
    spheres.forEach(function (sphere, i, spheres){
      newChildren.push(sphere);

      var fromPoint = sphere.position;
      var toPoint = i < spheres.length - 1 ? spheres[i+1].position : spheres[0].position;
      var newLine = module.exports.makeLine(fromPoint, toPoint);
      var oldLine = lines[i];
      newLine.constructionData = _.extend(oldLine.constructionData, newLine.constructionData);
      newChildren.push(newLine);
    });
  }

  var shape = module.exports.addShape(newOutline, extrudeSettings, 0xf08000, 0, 20, 0, util.toRad(90), 0, 0, 1);
  shape.name = "mounting plane shape";
  shape.constructionData = {
    points: shapeQue,  // copy all the points to make this shape
    rotationAxis : undefined, //set by selecting eave or ridge attributes

    rotationDegrees : undefined,
    calculatedRatioImperial : undefined,  //displayed 1= some ratio in feet and inches
    calculatedRatioMetric : undefined,
  };
  newChildren.push(shape);

  //create the group based on points and construction data
  group.children = [];
  // group.children=[];
  return newChildren;
};
