


function addMouseControl() {
  //orbit controls taken from http://www.smartjava.org/ltjs/chapter-05/03-basic-2d-geometries-shape.html
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;
};


//The mouse is really what we want, but in order to use the LookAt function, we need a position that is only available with a point.
var mouse = { x:0, y:0, z:0 };

console.log(mouse);
//We need this material to create a point
var mouseMat = new THREE.PointsMaterial( {color : 0x000000} );
var mouseGeo = new THREE.Geometry();
mouseGeo.vertices.push(mouse.x, 0, mouse.y);
//create the point geometry
var mousePos = new THREE.Points( mouseGeo, mouseMat );
mousePos.name = "current mouse position";
mousePos.visible = false;

window.addEventListener("mousemove", function (event){
  mouse.deltaX = mouse.x - event.x;
  mouse.deltaY = mouse.y - event.y;
  mouse.x = event.x;
  mouse.y = event.y;
  mouse.movementX = event.movementX;
  mouse.movementY = event.movementY; 
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
});
console.log(mousePos);

var shapeQue = [];
var shapeNum = 0;
var lineShape = {};
lineShape.lines =[];

function nameObj (object){
  var name = prompt("Please name this Object", "North Roof");
  object.name=name;
  objectTracker[name]=object;

}

var mouseStart = {};

window.addEventListener("mousedown", function (event){
  var intersects = getIntersects();
});

function getIntersects(){
  var intersects= raycaster.intersectObjects(scene.children);
  return intersects;
};
function lookAtMouse (){
  //gets all the children of the scene with name of mouseLook to look at the mouse position
  
  scene.children.forEach(function (val){
    if (val.name === "mouseLook"){
      console.log(val);
      console.log(mousePos);
      val.lookAt(new THREE.Vector3(2000,20,2000));

    }
  });



}

window.addEventListener("keyup", function (event){
  
 
  if (event.which === 65 ){ // a key
    var group = new THREE.Group();
    // get the top layer of intersect
    var intersects= getIntersects();
    shapeQue[shapeNum] = shapeQue[shapeNum] === undefined ? [] : shapeQue[shapeNum];
    var x = intersects[0].point.x;
    var y = intersects[0].point.y;
    var z = intersects[0].point.z;

    shapeQue[shapeNum].push(new THREE.Vector3(intersects[0].point.x, intersects[0].point.z));


    var geometry = new THREE.SphereGeometry( 1, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = x;
    sphere.position.y = y+20;
    sphere.position.z = z;
    scene.add( sphere );


    //add cylinder tubes to show vectors to next point
    //CylinderGeometry args (radius top, radius bottom, height, radius segments, height segments, openeded, theta start, theta length)
    if ( shapeQue[shapeNum].length > 0){
      var geometry = new THREE.CylinderGeometry( 1, 5, 20, 32 );
      var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
      var cylinder = new THREE.Mesh( geometry, material );
      cylinder.name = "mouseLook";
      scene.add( cylinder );
      
    }

    // scene.children[children.length-1].lookAt(mouse.position);

    //we are working with shapeQue[shapeNum] <- That will contain all of the points for a mounting plane.
    if (shapeQue[shapeNum].length > 1) { //make sure we have more than one point
     
      //we want to have a cylinder from the last point to the mouse cursor
        //first lets get the length of the cylinder that we need
        //then lets rotate it to get it to point in the right direction. then lets position it between the two points.
      //we want to have a cylinder between each of the points

    }

  }

  if (event.which ===32 ) {//spacebar 
      lookAtMouse();
      console.log(mousePos);

   
  }

  if (event.which === 13 ){ // enter key
    shapeNum++;
    shapeQue.forEach(function (outline){
      var newOutline =  new THREE.Shape();
      if (outline.length > 2){

        outline.forEach(function (coordinates, i) {
          if (i === 0){
            newOutline.moveTo(coordinates.x,coordinates.y);
          } else {
            newOutline.lineTo(coordinates.x, coordinates.y);
          }
        });
      
      }
      var group = addShape(newOutline, extrudeSettings, 0xf08000, 0, 20, 0, toRad(90), 0, 0, 1 );
      //transfer any objects put into the scene back into the group
      shapeQue[0].forEach(function (val){
        group.add(scene.children.pop());
            
      });
      shapeQue.pop();
      //add name here?
      // group.add(scene.children.pop());
      nameObj(group);

      scene.add(group);    
    });
  }
});

