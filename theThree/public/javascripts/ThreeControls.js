


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


function nameObj (object){
  var name = prompt("Please name this Object", "North Roof");
  object.name=name;
}

window.addEventListener("mousedown", function (event){
  var intersects = getIntersects();
  // intersects.forEach(function (val){console.log(val.object.name)})
});

function getIntersects(){
  // the Raycaster will check if it hits anything in the array (scene.children) and recurisvely check the childrens children (true)
  var intersects = raycaster.intersectObjects(scene.children, true);
  return intersects;
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



function orthographical (){
  if ($('#ortho')[0].value === "true"){
    return true;
  } else {
    return false;
  }
}

//add a cylinder to the scene to indicate where the line would go with the origin point being the last point in the shape queue and the current mouse position
function mouseline (start, end, name){
  removeMouseline();  // remove the old line before we add a new line
  shapeQue[shapeQue.length-1].y=20;  //set to the inital height of outline
  start = start || shapeQue[shapeQue.length-1];
  end =  end || new THREE.Vector3(mouse3D.x, 20, mouse3D.z);
  
  if (shapeQue.length > 1 && orthographical()){
    end = snapOrth(shapeQue[shapeQue.length-2], shapeQue[shapeQue.length-1],end);
  }
  var mouseline = makeLine(start, end);
  mouseline.name = name || "mouseline";  
  scene.add(mouseline);
};








window.addEventListener("keyup", function (event){
  // console.log(event);
  if (event.which ===79 ){ // o key
    var ortho = $('#ortho')[0];
    console.log(ortho); 
    toggleOrth(ortho);
    event.preventDefault();
  }

  if (event.which === 65 ){ // a key
    var group = new THREE.Group();
    var x, y, z;
    shapeQue = shapeQue || [];
    

    // get the top layer of intersect
    // look through the current list of intersects (calculated every frame) to see where our mouse hits the map plane
    intersects.forEach(function (intersect){
     
      if (intersect.object.name === "map"){
        x = intersect.point.x;
        y = intersect.point.y;
        z = intersect.point.z;
      }
    });
   
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
    shapeQue.push(new THREE.Vector3(x, 20, z));

    if (shapeQue.length===2){
      // reqAniFrameArray.push(animateSomething);
     
    }

    if (shapeQue.length === 1){
      //add a function to the reqAniFrameArray to recalc the cylinder & mouse position every time.
      reqAniFrameArray.push(mouseline);
    }

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

  
});

