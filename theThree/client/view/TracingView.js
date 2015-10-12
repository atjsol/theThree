var _ = require("lodash");
var eventBus = require("../lib/eventBus");
var urlBuilder = require("../lib/urlBuilder");
var THREE = require("three.js");
var util = require("../lib/util");
var TracingViewControls = require("./TracingViewControls");

var TracingView = module.exports = function($el) {
  _.bindAll(this);
  this.$el = $el;
  this.width = window.innerWidth;
  this.height = window.innerHeight;
  this.animationArray = [];
  this.init();


  this.controls = new TracingViewControls(this);
  eventBus.bind("change:map", _.debounce(this.handleMapChange, 100));
  this.animate();



};

TracingView.prototype = Object.create({


  init: function() {
    this.setupScene();
    this.drawGrid();
    this.drawOrigin();


  },

  setupScene: function() {
    var self = this;
    //Create the basic scene for this to work.  
    //Make a scene
    //Make a camera
    //Set the camera Position
    //Add The camera to the Scene
    //Make a light and add it to the camera so light source is always from the camera;

    //Create a Renderer - Ideally check if there is a WebGL Renderer - Can use canvas renderer - but that will cause performance issues

    var scene = this.scene = new THREE.Scene();
    var raycaster = this.raycaster = new THREE.Raycaster();
    //Orthographic Camera Provides better control for design work
    // var camera = new THREE.PerspectiveCamera( 40, this.width / this.height, 1, 10000 );
    var camera = this.camera = new THREE.OrthographicCamera(this.width / -2, this.width / 2, this.height / 2, this.height / -2, 1, 1000);
    // camera.position.z = 1000;
    camera.position.y = 340;
    camera.name = "Orthographic Camera";
    scene.add(camera);

    var light = new THREE.PointLight(0xffffff, 0.8);
    camera.add(light);

    var renderer = this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setSize(this.width, this.height);
    this.$el.html(renderer.domElement);

    window.addEventListener('resize', function onWindowResize() {
      var width = self.width = self.$el.width();
      var height = self.height = self.$el.height();

      var windowHalfX = width / 2;
      var windowHalfY = height / 2;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      //if ( webglRenderer ) { webglRenderer.setSize( window.innerWidth, window.innerHeight );}
      //if ( canvasRenderer ) {canvasRenderer.setSize( window.innerWidth, window.innerHeight );}
    }, false);
  },

  drawGrid: function(spacing, rows) {
    // This function draws a grid
    spacing = spacing ? spacing : 20;
    rows = rows ? rows : 10;
    var group = new THREE.Group();
    var material = new THREE.LineBasicMaterial({
      color: 0xff00ff
    });
    var offsetCenter = spacing * rows / 2;
    for (var i = 0; i <= rows; i++) {
      var vert = new THREE.Geometry();
      vert.vertices.push(new THREE.Vector3(spacing * i - offsetCenter, 0, -rows * spacing / 2));
      vert.vertices.push(new THREE.Vector3(spacing * i - offsetCenter, 0, rows * spacing / 2));
      var lineV = new THREE.Line(vert, material);
      group.add(lineV);

      var horiz = new THREE.Geometry();
      horiz.vertices.push(new THREE.Vector3(-rows * spacing / 2, 0, spacing * i - offsetCenter));
      horiz.vertices.push(new THREE.Vector3(rows * spacing / 2, 0, spacing * i - offsetCenter));
      var lineH = new THREE.Line(horiz, material);
      group.add(lineH);
    }
    group.name = "grid";
    this.scene.add(group);
  },

  //zTrack will create a cursor that tracks on the xz plane at y=0
  drawOrigin: function() {
    var cursorShape = new THREE.Geometry();
    cursorShape.vertices.push(new THREE.Vector3(-5, 0, 5));
    cursorShape.vertices.push(new THREE.Vector3(0, 0, 0));
    cursorShape.vertices.push(new THREE.Vector3(5, 0, 5));

    var material = new THREE.LineBasicMaterial({
      color: 0xff9999,
      linejoin: "miter",
    });

    var cursor = new THREE.Line(cursorShape, material);
    cursor.name = "cursor";
    this.scene.add(cursor);
  },



  getIntersects: function() {
    var intersects = this.raycaster.intersectObjects(this.scene.children, true);
    intersects.forEach(function(intersect) {
      if (intersect.object.name === "map") {
        intersects.map = new THREE.Vector3(intersect.point.x, 20, intersect.point.z);
      }
    });
    return intersects;
  },

  getMouse: function() {
    return this.controls.mouse;
  },

  addToAnimationArray: function(func) {
    this.animationArray.push(func);
  },

  resetAnimationArray: function() {
    this.animationArray = [];
  },

  removeChildren: function(name) {
    this.scene.children = _.filter(this.scene.children, function(child) {
      return child.name !== name;
    });
  },



  animate: function() {
    if (this.animationArray.length > 0) {
      this.animationArray.forEach(function(executable) {
        executable.call(null);
      });
    }

    var intersects = this.getIntersects();
    this.raycaster.setFromCamera(this.getMouse(), this.camera);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  },

  handleMapChange: function(mapObject) {
    var mapUrl = urlBuilder.buildMapUrl(mapObject);
    this.loadImage(mapUrl);
  },

  loadImage: function(path) {
    var self = this;
    var canvas = document.createElement('canvas');

    var context = canvas.getContext('2d');
    var planeXY = new THREE.PlaneGeometry(200, 200, 4);

    // $('body').on('input','#slider', function (event){
    //     console.log(this.value, parseInt(this.value,10), toRad(parseInt(this.value, 10)));
    //     console.log(planeXY);
    //     planeXY.rotation.set(toRad(parseInt(this.value,10)));
    // })


    var img = new Image();

    //this cross origin thing is huge, needs to be set before the img.src is set- if this is not set the canvas will be dirty and webGL will give us a bunch of errors
    img.crossOrigin = '';
    img.src = path;
    img.onload = function() {
      var height = img.height;
      var width = img.width;
      canvas.height = height;
      canvas.width = width;
      var degrees;


      context.translate(width / 2, height / 2);
      context.rotate(util.toRad(45));
      context.drawImage(img, -width / 2, -height / 2);


      var group = new THREE.Group();

      var texture = new THREE.Texture(canvas);

      texture.needsUpdate = true;
      texture.minFilter = THREE.LinearFilter;
      // texture.wrapS = THREE.RepeatWrapping;
      // texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
      var material = new THREE.MeshBasicMaterial({
        map: texture
      });

      var plane = new THREE.Mesh(planeXY, material);
      plane.rotation.set(util.toRad(-90), 0, 0);
      plane.name = "map";
      self.scene.add(plane);
    };
  }
});
