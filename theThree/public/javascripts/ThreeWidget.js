var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );

// camera.position.z = 1000;
camera.position.y = 340;
scene.add( camera );

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

var light = new THREE.PointLight( 0xffffff, 0.8 );
camera.add( light );

var group = new THREE.Group();
group.position.y = 0;
scene.add( group );

var objectTracker = {};

var outlinePoints = [];

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  if ( webglRenderer ) webglRenderer.setSize( window.innerWidth, window.innerHeight );
  if ( canvasRenderer ) canvasRenderer.setSize( window.innerWidth, window.innerHeight );

}


function randomShape (sides){
	for (var i =0; i < sides; i++){
		outlinePoints.push( new THREE.Vector2(Math.random()*100, Math.random()*100))
	}
}

// randomShape(8);

// up is Z!
function drawCenter(){
	var centerDraw = [];
	centerDraw.push(new THREE.Vector3( 5,0, 0));
	centerDraw.push(new THREE.Vector3(0, 0,10));
	centerDraw.push(new THREE.Vector3(-5,0, 0));
	var center = new THREE.Shape(centerDraw);
	// addShape(center, extrudeSettings, 0xf08000, 0, 10, 0, 0, 0, 0, 1);	
	// var points = center.createPointsGeometry();
	// var spacedPoints = center.createSpacedPointsGeometry( 4 );	
	var geometry = new THREE.ShapeGeometry( center );

	var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: 0xffffff, side: THREE.DoubleSide } ) );
	group.add( mesh );		
}
// drawCenter();
function setXZPlane(planeX, planeY, url) {
    // instantiate a loader
    var loader = new THREE.TextureLoader();

        console.log(url);
        loader.load(
        // resource URL
            url,
            // Function when resource is loaded
            function ( texture ) {

                // do something with the texture
                var tex = new THREE.MeshBasicMaterial( {
                    map: texture
                });
                var planeXY = new THREE.PlaneGeometry(planeX, planeY, 2);
                THREE.ImageUtils.crossOrigin = 'anonymous';
                // var texture = THREE.ImageUtils.loadTexture('http://maps.googleapis.com/maps/api/staticmap?center=Australia&size=640x400&style=element:labels|visibility:off&style=element:geometry.stroke|visibility:off&style=feature:landscape|element:geometry|saturation:-100&style=feature:water|saturation:-100|invert_lightness:true&key=AIzaSyBxxi5-bG4cnbPDPwZw0LfgSNzpPFOHs5E');
                var material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture })

                var plane = new THREE.Mesh(planeXY, material);
                plane.rotation.set(toRad(90), 0, 0);

                scene.add(plane);
            },
            // Function called when download progresses
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            // Function called when download errors
            function ( xhr ) {
                console.log( 'An error happened' );
            }
        );

    var tex;
    // load a resource
    
    //var texture = THREE.ImageUtils.loadTexture(loadMap()); 
  
};

function axisZ(spacing, rows){

	spacing = spacing ? spacing : 20;
	rows = rows ? rows : 10;
	var material = new THREE.LineBasicMaterial({
		color: 0xff00ff
	});
	var offsetCenter = spacing * rows/2
	for (var i = 0; i <= rows; i ++){
		var vert = new THREE.Geometry();
		vert.vertices.push(new THREE.Vector3(spacing * i - offsetCenter, 0, -100));
		vert.vertices.push(new THREE.Vector3(spacing * i - offsetCenter, 0, 100));
		var lineV = new THREE.Line( vert, material );
		scene.add( lineV );

		var horiz = new THREE.Geometry();
		horiz.vertices.push(new THREE.Vector3(-100, 0 , spacing * i - offsetCenter));
		horiz.vertices.push(new THREE.Vector3(+100, 0 , spacing * i - offsetCenter));
		var lineH = new THREE.Line(horiz, material);
		scene.add( lineH );
	}
}
axisZ();

//point cloud grouping 
function pcgroup(points) {
    //create group
    //add points to group
    //make mesh
    //add listeners to group for rotation

    //create new group
    //add points to group
    //make mesh
    //add listeners to group for rotation

    var particles = 500000;

    var geometry = new THREE.BufferGeometry();

    var positions = new Float32Array(particles * 3);
    var colors = new Float32Array(particles * 3);

    var color = new THREE.Color();

    var group = new THREE.Object3D();
    var n=200
    for (var i = 0; i < positions.length; i += 3) {

        // positions

        var x = Math.random() * n - n/2;
        var y = Math.random() * n - n/2;
        var z = Math.random() * n - n/2;

        positions[i] = x;
        positions[i + 1] = y;
        positions[i + 2] = z;

        // colors

        var vx = (x / n) + 0.5;
        var vy = (y / n) + 0.5;
        var vz = (z / n) + 0.5;

        color.setRGB(vx, vy, vz);

        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;

    }
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

    group.add(geometry)
    scene.add(group);
};






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
  scene.add( cursor );

};
zTrack();

function loadMap(mapObj) {
    // if mapObj does not exist - make it an object
    mapObj = !mapObj ? {} : mapObj;
    // initialize 
    var props = [
        'url',
        'zoom',
        'size',
        'scale',
        'key',
        'maptype',
        'center'
    ];
    var vals = [
        'https://maps.googleapis.com/maps/api/staticmap',
        '20',
        '512x512',
        '1',
        "AIzaSyBxxi5-bG4cnbPDPwZw0LfgSNzpPFOHs5E",
        "satellite",
        encodeURIComponent("368 Hollister Ave, Alameda, ca 94501")
    ];
    props.forEach(function (prop, i, array) {
        if (!mapObj.hasOwnProperty(prop)) {
            mapObj[prop] = vals[i];
        }

    });
    //build the query
    var urlQuery = Object.getOwnPropertyNames(mapObj)
        .reduce(function (queryString, property) {
        if (property === 'url') {
            return mapObj[property] + '?' + queryString;
        }
        return queryString + '&' + property + '=' + mapObj[property];
     }, '');

    var loader = new THREE.ImageLoader();
    var mapTexture = loader.load(
        urlQuery,
        function (event) {
            // onLoad function 
            console.log(event);
        },
        function (event) {
            //onProgress function 
            console.log("load progress event " + event);
        },
        function (event) {
            // on Error function
            console.log("load error " + event);
        }
    );
    return THREE.ImageUtils.loadTexture( mapTexture);
}

// var outline = new THREE.Shape( outlinePoints );

var extrudeSettings = { amount: 1, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

//function taken from http://threejs.org/examples/webgl_geometry_shapes.html
function addShape( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {

		var points = shape.createPointsGeometry();
		var spacedPoints = shape.createSpacedPointsGeometry( 50 );

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

		var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: color, side: THREE.DoubleSide } ) );
		mesh.position.set( x, y, z);
		mesh.rotation.set( rx, ry, rz );
		mesh.scale.set( s, s, s );
		group.add( mesh );

		// 3d shape

		// var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

		// var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: color } ) );
		// mesh.position.set( x, y, z );
		// mesh.rotation.set( rx, ry, rz );
		// mesh.scale.set( s, s, s );
		// nameObj(mesh);
  //   group.add( mesh );

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
}

//if you do not have an animation loop, it will not work;
var raycaster = new THREE.Raycaster();
function animate (){
	raycaster.setFromCamera(mouse, camera);
	renderer.render( scene, camera );
	requestAnimationFrame(animate);
}
function toRad(degrees){
  return degrees*Math.PI/180;
}

animate();
addMouseControl();