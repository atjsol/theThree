


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
  // intersects.forEach(function (val){console.log(val.object.name)})
});

function getIntersects(){
  var intersects = raycaster.intersectObjects(scene.children);
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


function thetaCalc (mouse, beginPoint, endPoint){
  var vector1 = {};
  var vector2 = {};

  vector1.x =  endPoint.x - beginPoint.x;
  vector1.y =  endPoint.y - beginPoint.y;

  vector2.x = mouse.x - endPoint.x;
  vector2.y = mouse.y - endPoint.y;

  var theta = Math.atan2(vector1.y, vector1.x)-Math.atan2(vector2.y, vector2.x);




} 

function perp (mouse, beginPoint, endPoint) {

  // var vector.x =  endPoint.x - beginPoint.x;
  // var vector.y =  endPoint.y - beginPoint.y;

  // slope = vector.y/vector.x;
  // inverseSlope = -1/slope;


  // var theta = Math.atan2(vector.y, vector.x);
  // var perpendicularAngle = theta + Math.PI/4;


  // return {x:mouse.x, y:}

  //calc angle to x axis
  //add PI/2 to get the new angle 
  //



}



function makeLine (fromPoint, toPoint){

  //CylinderGeometry args (radius top, radius bottom, height, radius segments, height segments, openeded, theta start, theta length)
  
  //calculate the distance
  var distance = fromPoint.distanceTo(toPoint);

  //create cylinder based onlength 
  var geometry = new THREE.CylinderGeometry( .25,  .25, distance, 32 );
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
  cylinder.lookAt(new THREE.Vector3(fromPoint.x,10000000000,fromPoint.z));

  //return the line so that it can be used by whoever called it.
  //can immediately be added to scene or group
  return cylinder;
};

window.addEventListener("click", function (event){
  // console.log(event);
  if (event.shiftKey){
    //get any of the spheres - that represent points - and add them to the grouped points
    var intersects = getIntersects();
    intersects.forEach(function (object){
      // check to see if the grouped points
    })
  }
});


window.addEventListener("keydown", function (event){
  if (event.which === 13){ //enter key
    //thie prevents the refresh when hitting the enter key
    event.preventDefault();
  }
});

function removeMouseline (){

  var children = scene.children;
  
  children.backwards(function (value, i){
    if (children[i].name === "mouseline"){
      children.splice(i,1);
    }
  });
  
};

//add a cylinder to the scene to indicate where the line would go with the origin point being the last point in the shape queue and the current mouse position
function mouseline (){
  removeMouseline();
  shapeQue[shapeQue.length-1].y=20;  //set to the inital height of outline
  var mouseline = makeLine(shapeQue[shapeQue.length-1], new THREE.Vector3(mouse3D.x, 20, mouse3D.z));
  mouseline.name = "mouseline";  
  scene.add(mouseline);
};


Array.prototype.backwards = function (func){
  for(var i = this.length-1; i >= 0; i--) {
    func.call(null, this[i], i, this )
  }
};

window.addEventListener("keyup", function (event){
  event.preventDefault();
  if (event.which === 65 ){ // a key
    var group = new THREE.Group();
    var x, y, z;

    // get the top layer of intersect
    shapeQue = shapeQue || [];
    // look through the current list of intersects (calculated every frame) to see where our mouse hits the map plane
    intersects.forEach(function (intersect){
     
      if (intersect.object.name === "map"){
        x = intersect.point.x;
        y = intersect.point.y;
        z = intersect.point.z;
      }
    });
    if (shapeQue.length === 1){
      //add a function to the reqAniFrameArray to recalc the cylinder & mouse position every time.
      reqAniFrameArray.push(mouseline);
    }

    //add cylinder tubes to show vectors to next point
    if ( shapeQue.length > 0){

      //get the most recently added sphere position - should be the last item added to the scene - added to scene to make it visible
      //# of children in the scene
      var lastChildPos;
      scene.children.backwards(function (object, i){
        if (!lastChildPos && object.name === "sphere"){
          lastChildPos = object.position;
        }
      });

      //offset the y so that all the xz points will be on the same plane
      cylinder = makeLine(lastChildPos, intersects.map);
      scene.add( cylinder );
    }

    //Add each point to our shapeQue - from which we wull eventually make a shape via extrusion
    shapeQue.push(new THREE.Vector3(x, 0, z));

    //Add the sphere to the scene to be visible representation of what we have in our queue
    var geometry = new THREE.SphereGeometry( .5, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var sphere = new THREE.Mesh( geometry, material );
    sphere.name = "sphere";
    sphere.position.x = x;
    sphere.position.y = 20;
    sphere.position.z = z;
    scene.add( sphere );
  
  }


  if (event.which ===13) {//enter key 
      // console.log(intersects);
      // event.preventDefault();
  }
  if (event.which ===32 ) {//spacebar 
      // console.log(intersects);
  }
  if (event.which === 83 ){ // s key
    //remove the mouseline animation when calculating the total shape
    for (var i = reqAniFrameArray.length-1; i >= 0 ; i--){
      if (reqAniFrameArray[i] === mouseline){
        reqAniFrameArray.splice(i,1);
      }
    }

    var newOutline =  new THREE.Shape();
    shapeQue.forEach(function (point, i , array){
      if (array.length > 2){
        if (i === 0){
          newOutline.moveTo(point.x, point.z);
        } else {
          newOutline.lineTo(point.x, point.z);
        }
      }
    });

    // remove any existing mouseline
    removeMouseline();
    var group = new THREE.Group();
    var shape = addShape(newOutline, extrudeSettings, 0xf08000, 0, 20, 0, toRad(90), 0, 0, 1 );
    shape.name = "mounting plane shape";
    group.add( shape );
    
    
    //transfer any objects put into the scene back into the group
    for(var i=scene.children.length-1; i > 0; i--){
      if (scene.children[i].name === "sphere" || scene.children[i].name === "cylinder"){
        group.add(scene.children.splice(i,1)[0])
      }
    }

   

    //reset the shapeQue
    shapeQue = [];

    //name the group
    nameObj(group);
    scene.add(group);    
   
  }
});

