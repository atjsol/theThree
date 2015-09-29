


function addMouseControl() {
  //orbit controls taken from http://www.smartjava.org/ltjs/chapter-05/03-basic-2d-geometries-shape.html
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;
};


//The mouse is really what we want, but in order to use the LookAt function, we need a position that is only available with a point.
var mouse = { x:0, y:0, z:0 };
var mouse3D;

//We need this material to create a point


window.addEventListener("mousemove", function (event){
  mouse.deltaX = mouse.x - event.x;
  mouse.deltaY = mouse.y - event.y;
  mouse.x = event.x;
  mouse.y = event.y;
  mouse.movementX = event.movementX;
  mouse.movementY = event.movementY; 
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  var intersects= getIntersects();
  if (intersects[0]){
    mouse3D = new THREE.Vector3(
      intersects[0].point.x,
      20,
      intersects[0].point.z
    );
  }
});



var shapeQue = [];
var lineShape = {};
lineShape.lines =[];

function nameObj (object){
  var name = prompt("Please name this Object", "North Roof");
  object.name=name;

}

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
     
      val.lookAt(mouse3D);
    }
  });
}

function makeLine (fromPoint, toPoint){

  //CylinderGeometry args (radius top, radius bottom, height, radius segments, height segments, openeded, theta start, theta length)
  
  //calculate the distance
  var distance = fromPoint.distanceTo(toPoint);

  //create cylinder based onlength 
  var geometry = new THREE.CylinderGeometry( 1,  1, distance, 32 );
  var material = new THREE.MeshBasicMaterial( {color: 0xff0022} );
  var cylinder = new THREE.Mesh( geometry, material );
  cylinder.name = "cylinder";

  //create a line to get the mid point via function
  var line = new THREE.Line3(fromPoint, new THREE.Vector3(toPoint.x,20,toPoint.z) );
  var mid = line.center();

  //Move the cylinder to the calculated mid position because that is the point where the object will pivot
  cylinder.position.x = mid.x;
  cylinder.position.y = mid.y;
  cylinder.position.z = mid.z;

  //Set the cylinder to look from one point to the next point
  //the 20000000000 helps to flatten the line to point from on point to another for some reason.  I do not understand this, but it works.
  cylinder.lookAt(new THREE.Vector3(fromPoint.x,20000000000,fromPoint.z));

  //return the line so that it can be used by whoever called it.
  //can immediately be added to scene or group
  return cylinder;
};






window.addEventListener("keyup", function (event){
  if (event.which === 65 ){ // a key
    var group = new THREE.Group();
    var x;
    var y;
    var z;
    // get the top layer of intersect
    shapeQue = shapeQue || [];
    // look through the current list of intersects (calculated every frame) to see where our mouse hits the map plane
    intersects.forEach(function (intersect){
      if (intersect.object.name === "map"){
        x = intersect.point.x;
        y = intersect.point.y;
        z = intersect.point.z;

        //add cylinder tubes to show vectors to next point
      
        if ( shapeQue.length > 0){
          //get the last shape position - should be the last item added to the scene - added to scene to make it visible
          //# of children in the scene
          var numOfChildren = scene.children.length;
          var lastChild = scene.children[numOfChildren-1];
          var lastChildPos = lastChild.position;
          //offset the y so that all the xz point will be on the same plane
          intersects.map.y=20;
          cylinder = makeLine(lastChildPos, intersects.map);
          scene.add( cylinder );

        }

        //Add each point to our shapeQue - from which we wull eventually make a shape via
        shapeQue.push(new THREE.Vector3(intersect.point.x, 20, intersect.point.z));

        var geometry = new THREE.SphereGeometry( 1, 32, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        var sphere = new THREE.Mesh( geometry, material );
        sphere.name = "sphere";
        sphere.position.x = x;
        sphere.position.y = 20;
        sphere.position.z = z;
        scene.add( sphere );
        
      }
    })

  }

  if (event.which ===32 ) {//spacebar 
      console.log(intersects);
  }

  if (event.which === 13 ){ // enter key
    
    var newOutline =  new THREE.Shape();
    shapeQue.forEach(function (point, i , array){
      if (array.length > 2){
        if (i === 0){
          newOutline.moveTo(point.x,point.z);
        } else {
          newOutline.lineTo(point.x, point.z);
        }
      }
    });
    var group = new THREE.Group();
    group.add( addShape(newOutline, extrudeSettings, 0xf08000, 0, 20, 0, toRad(90), 0, 0, 1 ) );
    //transfer any objects put into the scene back into the group
    shapeQue.forEach(function (val){
      group.add(scene.children.pop());
          
    });
    //reset the shapeQue
    shapeQue = [];

    //name the group
    nameObj(group);
    scene.add(group);    
   
  }
});

