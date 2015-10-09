var THREE = require("three.js");
THREE.OrbitControls = require('three-orbit-controls')(THREE);
var _ = require("lodash");
var lineMaker = require("../lib/lineMaker");
var extrudeSettings = require("../lib/extrudeSettings");
var util = require("../lib/util");

var TracingViewControls = module.exports = function(tracingView) {
  var self = this;
  _.bindAll(this);
  this.tracingView = tracingView;
  this.$el = tracingView.$el;
  this.trackMouse();
  this.setUpOrbitalControls();
  //this.$el.on("keyup", this.handleKeyUp);
  window.addEventListener("keyup", function(event) {
    self.handleKeyUp(event); // TODO: FIX ME
  });
  this.shapeQue = [];

};

TracingViewControls.prototype = Object.create({
  setUpOrbitalControls: function() {
    var controls = new THREE.OrbitControls(this.tracingView.camera, this.tracingView.renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
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

    debugger;
    this.$el.on("mousemove", function($event) {
      var event = $event.originalEvent;
      mouse.deltaX = mouse.x - event.x;
      mouse.deltaY = mouse.y - event.y;

      mouse.movementX = event.movementX;
      mouse.movementY = event.movementY;
      mouse.x = (event.clientX / self.tracingView.width) * 2 - 1;
      mouse.y = -(event.clientY / self.tracingView.height) * 2 + 1;
      var intersects = self.tracingView.getIntersects();
      if (intersects[0]) {
        self.mouse3D = new THREE.Vector3(
          intersects[0].point.x,
          20,
          intersects[0].point.z
        );
      }
    });
  },

  handleKeyUp: function(event) {
    var self = this;
    var scene = this.tracingView.scene;
    var shapeQue = this.shapeQue;
    var mouse3D = this.mouse3D;
    if (event.which === 65) { // a key
      var intersects = self.tracingView.getIntersects();
      var group = new THREE.Group();
      var x, y, z;

      // get the top layer of intersect
      // look through the current list of intersects (calculated every frame) to see where our mouse hits the map plane
      intersects.forEach(function(intersect) {

        if (intersect.object.name === "map") {
          x = intersect.point.x;
          y = intersect.point.y;
          z = intersect.point.z;
        }
      });

      //add cylinder tubes to show vectors to next point
      if (shapeQue.length > 0) {

        //get the most recently added sphere position - should be the last item added to the scene - added to scene to make it visible
        //# of children in the scene
        var lastChildPos;
        util.backwards(scene.children, function(object, i) {
          if (!lastChildPos && object.name === "sphere") {
            lastChildPos = object.position;
          }
        });

        //offset the y so that all the xz points will be on the same plane
        var cylinder = lineMaker.makeLine(lastChildPos, intersects.map);
        scene.add(cylinder);
      }

      //Add each point to our shapeQue - from which we wull eventually make a shape via extrusion
      shapeQue.push(new THREE.Vector3(x, 20, z));

      if (shapeQue.length === 2) {
        // reqAniFrameArray.push(animateSomething);
      }

      if (shapeQue.length === 1) {
        //add a function to the reqAniFrameArray to recalc the cylinder & mouse position every time.
        this.tracingView.addToAnimationArray(function(start, end, name) {
          self.tracingView.removeChildren("mouseline"); // remove the old line before we add a new line
          shapeQue[shapeQue.length - 1].y = 20; //set to the inital height of outline
          start = start || shapeQue[shapeQue.length - 1];
          end = end || new THREE.Vector3(mouse3D.x, 20, mouse3D.z);
          if (shapeQue.length > 1) {
            end = lineMaker.snapOrth(shapeQue[shapeQue.length - 2], shapeQue[shapeQue.length - 1], end);
          }
          var mouseline = lineMaker.makeLine(start, end);
          mouseline.name = name || "mouseline";
          scene.add(mouseline);
        });
      }

      //Add the sphere to the scene to be visible representation of what we have in our queue
      var geometry = new THREE.SphereGeometry(0.5, 32, 32);
      var material = new THREE.MeshBasicMaterial({
        color: 0xffff00
      });
      var sphere = new THREE.Mesh(geometry, material);
      sphere.name = "sphere";
      sphere.position.x = x;
      sphere.position.y = 20;
      sphere.position.z = z;
      scene.add(sphere);
    }

    if (event.which === 83) { // s key
      //remove the mouseline animation when calculating the total shape
      this.tracingView.resetAnimationArray();

      // remove any existing mouseline
      this.tracingView.removeChildren("mouseline");

      var newOutline = new THREE.Shape();
      shapeQue.forEach(function(point, i, array) {
        if (array.length > 2) {
          if (i === 0) {
            newOutline.moveTo(point.x, point.z);
          } else {
            newOutline.lineTo(point.x, point.z);
          }
        }
      });

      //add final line between the first and last points in the shape
      scene.add(lineMaker.makeLine(shapeQue[0], shapeQue[shapeQue.length - 1]));

      var group = new THREE.Group();
      var shape = lineMaker.addShape(newOutline, extrudeSettings, 0xf08000, 0, 20, 0, util.toRad(90), 0, 0, 1);
      shape.name = "mounting plane shape";
      group.add(shape);

      //transfer any objects put into the scene back into the group
      for (var i = scene.children.length - 1; i > 0; i--) {
        if (scene.children[i].name === "sphere" || scene.children[i].name === "cylinder") {
          group.add(scene.children.splice(i, 1)[0]);
        }
      }

      //reset the shapeQue
      this.shapeQue = [];

      //name the group
      var name = prompt("Please name this Object", "North Roof"); //jshint ignore:line
      group.name = name;
      scene.add(group);

    }

  },
});
