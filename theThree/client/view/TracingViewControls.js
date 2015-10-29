var $ = require("jquery");
var THREE = require("three.js");
THREE.OrbitControls = require("three-orbit-controls")(THREE);
var _ = require("lodash");
var extrudeSettings = require("../lib/extrudeSettings");
var util = require("../lib/util");
var eventBus = require("../lib/eventBus");
var GeometryMaker = require("../lib/GeometryMaker");
var orthogonalStatus = require("./orthogonalStatus");
var _2D3DStatus = require("./2D3DStatus");
var extrudeSettings = require("../lib/extrudeSettings");
var ObjectAttributeView = require("./ObjectAttributeView");

var TracingViewControls = module.exports = function(tracingView) {
  var self = this;
  _.bindAll(this);
  this.tracingView = tracingView;
  this.$el = tracingView.$el;
  this.setUpOrbitalControls();
  this.tracingView.orthEnd = false;
  this.intialHeight = 20;
  this.shapeQue = [];
  this.dragging = false;
  this.dragTarget = undefined;
  this.dragTargetGrabVector = undefined;
  this.objectAttributeView = new ObjectAttributeView($("#object-attribute-view"), this);

  this.trackMouse();
  $(document).on("keydown", function(event) {
    self.handleKeyDown(event); // TODO: FIX ME
  });
  this.$el.on("mousedown", this.handleMouseDown);
  this.$el.on("mouseup", this.handleMouseUp);
  _2D3DStatus.bind("change:status", this.update2D3D);
};

TracingViewControls.prototype = Object.create({

  setUpOrbitalControls: function() {
    var controls = new THREE.OrbitControls(this.tracingView.camera, this.tracingView.renderer.domElement);
    this.controls = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.noRotate = true;
  },

  update2D3D: function() {
    this.controls.noRotate = !_2D3DStatus.getStatus();
  },

  trackMouse: function() {
    var self = this;
    if (!this.mouse) {
      this.mouse = {
        x: 0,
        y: 0,
        z: 0
      };
    }
    var mouse = this.mouse;

    this.$el.on("mousemove", function($event) {


      var event = $event.originalEvent;


      mouse.deltaX = mouse.x - event.x;
      mouse.deltaY = mouse.y - event.y;

      mouse.movementX = event.movementX;
      mouse.movementY = event.movementY;
      mouse.x = (event.clientX / self.tracingView.width) * 2 - 1;
      mouse.y = -(event.clientY / self.tracingView.height) * 2 + 1;
      var intersects = self.tracingView.getIntersects();
      intersects.forEach(function(intersect){
        if (intersect.object.name==="map"){
          intersect.object.getWorldPosition();
          self.mouse3D = new THREE.Vector3(
            intersect.point.x,
            self.intialHeight,
            intersect.point.z
          );
        }
      });

      if (self.dragging) {
        self.editObject(event);
      }
    });

  },
  editObject: function(event) {
    var self = this;
    var intersects = self.tracingView.getIntersects();
    var x, y, z;
    _.forEachRight(intersects, function(intersect) {
      if (intersect.object.name === "map" && !x) {
        x = intersect.point.x;
        y = intersect.point.y;
        z = intersect.point.z;
        if (self.dragTargetGrabVector === undefined) {
          self.dragTargetGrabVector = intersect.point.clone();
        }
      }
    });

    if (self.dragTarget) {
      self.dragTarget.position.setX(x);
      self.dragTarget.position.setZ(z);
    }

  },

  animateLine: function(start, end, name) {
    this.tracingView.removeChildren("mouseline"); // remove the old line before we add a new line
    this.shapeQue[this.shapeQue.length - 1].y = this.intialHeight; //set to the inital height of outline
    start = start || this.shapeQue[this.shapeQue.length - 1];
    end = end || new THREE.Vector3(this.mouse3D.x, this.intialHeight, this.mouse3D.z);
    if (this.shapeQue.length > 1 && orthogonalStatus.getStatus()) {
      end = GeometryMaker.snapOrth(this.shapeQue[this.shapeQue.length - 2], this.shapeQue[this.shapeQue.length - 1], end);
      this.tracingView.orthEnd = end.clone();
    }
    if (end.x === 0 && end.y === 20 && end.z === 0 ){
      console.log("zero");
    }
    var mouseline = GeometryMaker.makeLine(start, end, 0.25);
    mouseline.name = name || "mouseline";
    this.tracingView.scene.add(mouseline);
  },

  addPoint: function() {
    var self = this;
    var scene = this.tracingView.scene;
    var shapeQue = self.shapeQue;

    var intersects = self.tracingView.getIntersects();
    var group = new THREE.Group();
    var x, y, z;
    // get the top layer of intersect
    // look through the current list of intersects (calculated every frame) to see where our mouse hits the map plane
    _.forEachRight(intersects, function(intersect) {
      var object = intersect.object;
      if (object.name === "map" && !x) {
        x = intersect.point.x;
        y = intersect.point.y;
        z = intersect.point.z;
      }

      //if we happen to hit a sphere- we would like to use the sphere coordinates instead
      else if (object.name === "sphere") {
        x = object.position.x;
        y = object.position.y;
        z = object.position.z;
      } else if (object.name === "sphereChild") {
        x = object.parent.position.x;
        y = object.parent.position.y;
        z = object.parent.position.z;
      }
    });

    //Add each point to our shapeQue - from which we wull eventually make a shape via extrusion
    if (orthogonalStatus.getStatus() && shapeQue.length >= 2) {
      shapeQue.push(new THREE.Vector3(self.tracingView.orthEnd.x, 20, self.tracingView.orthEnd.z));
    } else {
      shapeQue.push(new THREE.Vector3(x, 20, z));
    }

    if (shapeQue.length === 2) {
      var a = shapeQue[0].clone();
      var b = shapeQue[1].clone();
      var roofPlanes = this.tracingView.getRoofPlanes();
      if (roofPlanes && roofPlanes.length < 1) {
        this.tracingView.align(a, b);
      }
    }

    //add cylinder tubes to show vectors to next point
    if (shapeQue.length > 1) {

      //get the most recently added sphere position
      var cylinder = GeometryMaker.makeLine(shapeQue[shapeQue.length - 1], shapeQue[shapeQue.length - 2]);

      scene.add(cylinder);
    }

    if (shapeQue.length === 1) {
      //add a function to the reqAniFrameArray to recalc the cylinder & mouse position every time.
      this.tracingView.addToAnimationArray(self.animateLine);
    }
    var position = shapeQue[shapeQue.length - 1];
    //Add the sphere to the scene to be visible representation of what we have in our queue
    var sphere = GeometryMaker.sphere(position);

    scene.add(sphere);
  },

  addShape: function() {
    var self = this;
    var scene = this.tracingView.scene;
    var shapeQue = self.shapeQue;

    if (shapeQue.length < 3) {
      return;
    }
    //remove the mouseline animation when calculating the total shape
    this.tracingView.resetAnimationArray();

    // remove any existing mouseline
    this.tracingView.removeChildren("mouseline");

    var group = new THREE.Group();
    var newChildren = GeometryMaker.buildGroup(group, shapeQue);


    //delete any objects put into the scene to indicate how the group will be constructed
    for (var i = scene.children.length - 1; i > 0; i--) {
      if (scene.children[i].name === "sphere" || scene.children[i].name === "cylinder") {
        scene.children.splice(i, 1);
      }
    }

    var name = "Roof Plane";
    group.name = name;
    //reset the shapeQue
    this.shapeQue = [];
    newChildren.forEach(function(child) {
      group.add(child);
    });
    // group.children = newChildren;
    scene.add(group);
    eventBus.trigger("change:scene");
  },

  handleKeyDown: function(event) {
    var self = this;
    var scene = this.tracingView.scene;
    var shapeQue = self.shapeQue;

    if (event.which === 16) { // shift key
      var intersects = self.tracingView.getIntersects();
      this.objectAttributeView.addToInterface(intersects);
      console.log(intersects);
    }

    if (event.which === 65) { // a key
      this.addPoint();
    }
    if (event.which === 83) { // s key
      this.addShape();
    }
    if (event.which === 90 && event.ctlKey) { // z key
      var deleteableItems = ["sphere", "mounting plane shape", "mounting plane tilted", "cylinder"];
      var last = scene.children[scene.children.length - 1];
      if (_.any(deleteableItems, function(val) {
          return val === last.name;
        })) {
        scene.children.pop();
      }

    }
    if (event.which === 79) { // o key
      orthogonalStatus.invertStatus();
    }

    if (event.which === 49 && event.altKey) // 1
    {
      // Top View
      this.tracingView.camera.position.set(0, 500, 0);
      this.tracingView.camera.up = new THREE.Vector3(0, 0, -1);
      this.tracingView.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    if (event.which === 50 && event.altKey) // 2
    {
      // Right View
      this.tracingView.camera.position.set(500, 0, 0);
      this.tracingView.camera.up = new THREE.Vector3(0, 1, 0);
      this.tracingView.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    if (event.which === 51 && event.altKey) // 3
    {
      // Left View
      this.tracingView.camera.position.set(-500, 0, 0);
      this.tracingView.camera.up = new THREE.Vector3(0, 1, 0);
      this.tracingView.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    if (event.which === 52 && event.altKey) // 4
    {
      // Front View
      this.tracingView.camera.position.set(0, 0, 500);
      this.tracingView.camera.up = new THREE.Vector3(0, 1, 0);
      this.tracingView.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    if (event.which === 53 && event.altKey) // 5
    {
      // Back View
      this.tracingView.camera.position.set(0, 0, -500);
      this.tracingView.camera.up = new THREE.Vector3(0, 1, 0);
      this.tracingView.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    if (event.which === 54 && event.altKey) // 6
    {
      // Iso View
      var rotation = 45;
      var pitch = 35;
      var x = 500 * Math.cos(30 * Math.PI / 180) * Math.sin((90 - rotation) * Math.PI / 180);
      var y = 500 * Math.sin(30 * Math.PI / 180);
      var z = 500 * Math.cos(30 * Math.PI / 180) * Math.sin(rotation * Math.PI / 180);
      this.tracingView.camera.position.set(x, y, z);
      this.tracingView.camera.up = new THREE.Vector3(0, 1, 0);
      this.tracingView.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
    // event.preventDefault();
    // event.stopPropagation();
  },

  handleMouseDown: function(e) {
    var self = this;
    var intersects = self.tracingView.getIntersects();
    if (intersects.length > 0 && intersects[0].object.parent) {
      self.objectAttributeView.addToInterface(intersects);
      self.dragging = true;
      var firstSelected = util.filterRaycast(intersects);
      if(firstSelected){
        if (firstSelected.object.parent.name === "sphere") {
          self.dragTarget = firstSelected.object.parent;

        } else if (firstSelected.object.name === "cylinder") {
          self.dragTarget = firstSelected.object;

        }
        
      }
    }
  },

  handleMouseUp: function(e) {
    var self = this;

    if (!self.dragging) {
      return;
    }

    if (self.dragTarget && self.dragTarget.parent) {
      var child = self.dragTarget;
      var group = child.parent;
      var newChildren = GeometryMaker.buildGroup(group);
      newChildren.forEach(function(child) {
        group.add(child);
      });
      eventBus.trigger("change:scene");
      if (self.dragTarget.parent.hasOwnProperty("rotationVector")) {
        this.objectAttributeView.updateRotation({
          data: self.dragTarget,
          target: {
            value: self.dragTarget.parent.rotationVector.applied
          }
        });

      }

      self.dragging = false;
      self.dragTarget = undefined;
      self.dragTargetGrabVector = undefined;

    }
  },

  alignCamera: function(theta) {
    var oldNoRotate = this.controls.noRotate;
    this.controls.reset();
    this.controls.noRotate = false;
    this.controls.rotateLeft(-1 * (Math.PI / 2 + theta));
    this.controls.update();
    this.controls.noRotate = oldNoRotate;
  }
});
