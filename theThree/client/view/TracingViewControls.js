var THREE = require("three.js");
THREE.OrbitControls = require('three-orbit-controls')(THREE);
var TracingViewControls = module.exports = function(tracingView) {
  this.tracingView = tracingView;
  this.$el = tracingView.$el;
  this.trackMouse();
  this.setUpOrbitalControls();


};

TracingViewControls.prototype = Object.create({
  setUpOrbitalControls : function (){
    controls = new THREE.OrbitControls( this.tracingView.camera, this.tracingView.renderer.domElement );
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


    this.$el.on("mousemove", function(event) {
      mouse.deltaX = mouse.x - event.x;
      mouse.deltaY = mouse.y - event.y;

      mouse.movementX = event.movementX;
      mouse.movementY = event.movementY;
      mouse.x = (event.clientX / self.width) * 2 - 1;
      mouse.y = -(event.clientY / self.height) * 2 + 1;
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


});
