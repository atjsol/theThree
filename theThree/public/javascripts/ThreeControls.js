


function addMouseControl() {
  //orbit controls taken from http://www.smartjava.org/ltjs/chapter-05/03-basic-2d-geometries-shape.html
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;
};



var mouse = new THREE.Vector2();
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

var shapeQue = [];
var shapeNum = 0;
var lineShape = {};
lineShape.lines =[];

function nameObj (object){
  var name = prompt("Please name this Object", "North Roof");
  objectTracker[name]=object; 
}

var mouseStart = {};
window.addEventListener("keydown", function (event){
  var intersects = getIntersects();
  var x = intersects[0].point.x;
  var y = intersects[0].point.y;
  var z = intersects[0].point.z;
});


window.addEventListener("mousedown", function (event){
  var intersects = getIntersects();
});

function getIntersects(){
  var intersects= raycaster.intersectObjects(scene.children);
  return intersects;
}

function manual (){
  var UI = document.getElementById('ui-Controls');
  if (UI){
    
  }


};

window.addEventListener("keyup", function (event){
  
 
  if (event.which === 65 ){ // a key
    // get the top layer of intersect
    var intersects= getIntersects();
    shapeQue[shapeNum] = shapeQue[shapeNum] === undefined ? [] : shapeQue[shapeNum];
    var x = intersects[0].point.x;
    var y = intersects[0].point.y;
    var z = intersects[0].point.z;

    shapeQue[shapeNum].push(new THREE.Vector2(intersects[0].point.x, intersects[0].point.z));


    var geometry = new THREE.SphereGeometry( 1, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = x;
    sphere.position.y = y+20;
    sphere.position.z = z;
    scene.add( sphere );


    //add cylinder tubes to show vectors to next point
    var geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    var cylinder = new THREE.Mesh( geometry, material );
    scene.add( cylinder );


  }

  if (event.which ===32 ) {//spacebar 
    manual();
  }

  if (event.which === 13 ){ // enter key
    shapeNum++;
    shapeQue.forEach(function (outline){
      var newOutline =  new THREE.Shape();
      if (outline.length > 2){

        outline.forEach(function (coordinates, i) {
          console.log(coordinates);
          if (i === 0){
            newOutline.moveTo(coordinates.x,coordinates.y);
          } else {
            newOutline.lineTo(coordinates.x, coordinates.y);
          }
        });
      
      }
      addShape(newOutline, extrudeSettings, 0xf08000, 0, 20, 0, toRad(90), 0, 0, 1 );
    });
  }
});

