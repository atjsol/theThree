//Create the basic scene for this to work.  
  //Make a scene
  //Make a camera
  //Set the camera Position
  //Add The camera to the Scene
  //Make a light and add it to the camera so light source is always from the camera;

  //Create a Renderer - Ideally check if there is a WebGL Renderer - Can use canvas renderer - but that will cause performance issues


var scene = new THREE.Scene();
//Orthographic Camera Provides better control for design work
// var camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
var camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
// camera.position.z = 1000;
camera.position.y = 340;
camera.name = "Orthographic Camera";
scene.add( camera );

var light = new THREE.PointLight( 0xffffff, 0.8 );
camera.add(light);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );






window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  if ( webglRenderer ) webglRenderer.setSize( window.innerWidth, window.innerHeight );
  if ( canvasRenderer ) canvasRenderer.setSize( window.innerWidth, window.innerHeight );

}

function axisZ(spacing, rows){
// This function draws a grid
	spacing = spacing ? spacing : 20;
	rows = rows ? rows : 10;
  var group = new THREE.Group();
	var material = new THREE.LineBasicMaterial({
		color: 0xff00ff
	});
	var offsetCenter = spacing * rows/2;
	for (var i = 0; i <= rows; i ++){
		var vert = new THREE.Geometry();
		vert.vertices.push(new THREE.Vector3(spacing * i - offsetCenter, 0, -rows*spacing/2));
		vert.vertices.push(new THREE.Vector3(spacing * i - offsetCenter, 0, rows*spacing/2));
		var lineV = new THREE.Line( vert, material );
		group.add( lineV );

		var horiz = new THREE.Geometry();
		horiz.vertices.push(new THREE.Vector3( -rows*spacing/2, 0 , spacing * i - offsetCenter));
		horiz.vertices.push(new THREE.Vector3( rows*spacing/2, 0 , spacing * i - offsetCenter));
		var lineH = new THREE.Line(horiz, material);
		group.add( lineH );
	}
    group.name="grid";
    scene.add( group );
}
axisZ();

//zTrack will create a cursor that tracks on the xz plane at y=0
function zTrack () {
  var cursorShape = new THREE.Geometry();
  cursorShape.vertices.push(new THREE.Vector3(-5, 0, 5));
  cursorShape.vertices.push(new THREE.Vector3(0, 0, 0));
  cursorShape.vertices.push(new THREE.Vector3(5, 0, 5));

  var material = new THREE.LineBasicMaterial({
    color: 0xff9999,
    linejoin:"miter",
  });

  var cursor = new THREE.Line( cursorShape, material );
  cursor.name = "cursor";
  scene.add( cursor );

};
zTrack();

var extrudeSettings = { amount: 20, bevelEnabled: false, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

//function taken from http://threejs.org/examples/webgl_geometry_shapes.html
function addShape( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {

	var points = shape.createPointsGeometry();
	var spacedPoints = shape.createSpacedPointsGeometry( 50 );
  var group = new THREE.Group();

	// flat shape with texture
	// note: default UVs generated by ShapeGemoetry are simply the x- and y-coordinates of the vertices

	// var geometry = new THREE.ShapeGeometry( shape );

	// var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { side: THREE.DoubleSide} ) );
	// mesh.position.set( x, y, z  );
	// mesh.rotation.set( rx, ry, rz );
	// mesh.scale.set( s, s, s );
	// group.add( mesh );

	// // flat shape

	// var geometry = new THREE.ShapeGeometry( shape );

	// var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: color, side: THREE.DoubleSide } ) );
	// mesh.position.set( x, y, z);
	// mesh.rotation.set( rx, ry, rz );
	// mesh.scale.set( s, s, s );
	
 //    var group = new THREE.Group();
 //    group.add( mesh );

	// 3d shape

	var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

	var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: color } ) );
	mesh.position.set( x, y, z );
	mesh.rotation.set( rx, ry, rz );
	mesh.scale.set( s, s, s );

  group.add( mesh );

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
}

//if you do not have an animation loop, it will not work;
var raycaster = new THREE.Raycaster();
var intersects = []; 

function animate (){
  intersects = getIntersects();

  intersects.forEach(function (object){
    if (object.object.name === "map"){
      intersects.map= new THREE.Vector3(object.point.x, 20, object.point.z); 
    }
  });
	raycaster.setFromCamera(mouse, camera);
	renderer.render( scene, camera );
	requestAnimationFrame(animate);
}
function toRad(degrees){
  return degrees*Math.PI/180;
}

animate();
addMouseControl();