var $ = require("jquery");
require("jquery-ui");
var THREE = require("three.js");
var _ = require("lodash");
var eventBus = require("../lib/eventBus");
var util = require("../lib/util");

var ObjectAttributeView = module.exports = function($el) {
  _.bindAll(this);
  this.$el = $el;
  this.currentObject = {};
};


ObjectAttributeView.prototype = Object.create({
  toHtml : function (val, tag, clas){
    function brackets (val){
      return "<"+val+">";
    }
    tag = tag || "div";
    clas = clas || ""; 
    return brackets(tag + " class=" + clas )+val+brackets("/"+tag);
  }, 

  addToInterface:function (objArray){
    var self = this;
    //ignore things we do not care about - things we created
    var ignore = ["map", "grid", "Orthographic Camera", "cursor", "lineV", "lineH"];
    var ignoreObj = util.arrToObj(ignore);
    if (objArray.length === 0 || ignoreObj[objArray[0].object.name]) {
      this.closeAccordion();
      return;
    }
    //expecting an array of objects
    //only choose the first item

    var someObj = this.currentObject = objArray[0].object;
  
    
    var total = "";
    var body = "";
    //create header by object name
    var header = _.template('<h3 class="attribute-list"> <%= name %> </h3>');
    var compiledHeader = header(someObj);
    

    if (someObj.name === "cylinder"){   
      var distance = _.template('<h5>Length</h5>'
        +'<ul class="attribute-list"><li>Computed Length : <%= length %>px</li>'
        +'<li>Real World Length :<input type="number"> </li></ul>'
      );
      var length = someObj.constructionData.points[0].distanceTo(someObj.constructionData.points[1]);
      var compiledDistance = distance({length:length}); 
      body+=compiledDistance;

      var attributes = _.template('<h5>Attributes</h5>'
        +'<input type="radio" name="type" data-actions="setEaveVector assignType" value="EAVE">Eave'
        +'<input type="radio" name="type" data-actions="assignType" value="RIDGE">Ridge'
        +'<input type="radio" name="type" data-actions="assignType" value="VALLEY">Valley'
        +'<input type="radio" name="type" data-actions="assignType" value="HIP">Hip' 
        +'<input type="radio" name="type" data-actions="assignType" value="RAKE">Rake'
        +'<input type="radio" name="type" data-actions="assignType" value="STEPFLASH">Stepflash'
        +'<input type="radio" name="type" data-actions="assignType" value="FLASHING">Flashing'


      );

      var compiledAttributes = attributes({});
      body+= compiledAttributes;

    }

    var position = _.template(
       '<h5>Position</h5>'
      +'<ul class="attribute-list">'
        +'<li> x : <input name="position setX" data-actions="position setX" type="number" step="0.01" value="<%= x %>"</li>'
        +'<li> y (up) : <input name="position setY" data-actions="position setY" type="number" step="0.01" value="<%= y %>"</li>'
        +'<li> z : <input name="position setZ" data-actions="position setZ" type="number" step="0.01" value="<%= z %>"</li>'
      +'</ul>');
    var compiledPosition = position(someObj.getWorldPosition());
    body += compiledPosition;
    
    if (someObj.hasOwnProperty("planeRotation")){
      var rotation = _.template('<h5>Rotation</h5><ul class="attribute-list"><li><input type="number" name="updateRoataion" data-actions="updateRotation" val=<%= planeRotation %></li></ul>');
      var compiledRotation = rotation(someObj); 
      body+=compiledRotation;
    } 

    body=this.toHtml(body);
    
    total = compiledHeader + body;

    this.closeAccordion();

    this.$el.append(total);
    if (this.currentObject.name === "cylinder"){
      this.$el.find("input[name='type'][ value='" + this.currentObject.constructionData.type + "']").prop("checked", true);
    }

    
    this.$el.on("change", someObj, function (e){ 
      // e.data is where our passed in data (from $('change", data, callback)) resides
      // e.target is where the change has occurred
      // e.target.dataset.* can be used to add any additional info as needed
      e.preventDefault();
      e.stopPropagation();
      self.updateGroupModel(e);
    });
    this.$el.accordion({
      collapsible:true,
      heightstyle:"content",
    });
  },

  closeAccordion: function(e){
    //remove any events
    if (this.$el.hasClass("ui-accordion")){
      this.$el.accordion("destroy"); 
    }
    this.$el.off("change"); // remove all previous event handlers
    this.$el.empty();
  },

  assignType : function (e){
    //search through the lines and find where the points match up
    //set the linetype
    // e.target.value is where our the type is located
    // window.tracingView.job.structures[number].mountingPlanes[number].lines would be where a line exists
    this.currentObject.constructionData.type=e.target.value;



  },

  updateGroupModel : function (e){
    var self = this;
    
    // e.data is where our passed in data (from $('change", data, callback)) resides
    // e.target is where the change has occurred
    // e.target.dataset.* can be used to add any additional info as needed (currently set at target.dataset.action="string")
    // var name = evnt.target.name.split(" ");
    var actions = e.target.dataset.actions;
    var actionArray = actions.split(" ");
    actionArray.forEach(function (action){
      self[action](e);
    });
  },

  setEaveVector : function (e){
    //get the two points used to make the cylinder
    //subtract them from each other to get a resultant vector
    // normalize the vector because the set rotation is expecting normalized.
    var vector1 = e.data.constructionData.points[0].clone();
    var vector2 = e.data.constructionData.points[1].clone();
    var normalized = vector1.sub(vector2);


    //sets the group level as holder of the rotation vector
    e.data.parent.rotationVector = {};
    e.data.parent.rotationVector.normal = normalized;
    e.data.parent.rotationVector.start = vector1;
    e.data.parent.rotationVector.end = vector2;
    e.data.parent.vectorOffset = e.data.constructionData.points[1].clone();
    //TODO:  Ensure all other lines are not set as eave for this mounting plane
  },

  updateRotation : function (e){
    //apply rotation to group
    var group = e.data.parent;
    this.translatePointforRotation(e);
  

    group.translateOnAxis(group.vectorOffset, 1);
    group.setRotationFromAxisAngle(group.rotationVector.normal.normalize(),  util.toRad(e.target.value));
    group.translateOnAxis(group.vectorOffset, -1);

    if (!this.verifyUp(e)){
      group.translateOnAxis(group.vectorOffset, 1);
      group.setRotationFromAxisAngle(group.rotationVector.normal.negate().normalize(),  util.toRad(e.target.value));
      group.translateOnAxis(group.vectorOffset, -1);
    }
  },

  translatePointforRotation : function (e){
    var group = e.data.parent;
    var newMountingPlanePath = [];
    group.children.forEach(function(child){
      if (child.name === "sphere"){

        var point = child.getWorldPosition();
        point.y = group.vectorOffset.y;
        var line = new THREE.Line3(group.rotationVector.start, group.rotationVector.end);

        var material = new THREE.LineBasicMaterial({
          color: 0x0000ff
        });

        var lineGeo = new THREE.Geometry();
        lineGeo.vertices.push(group.rotationVector.start, group.rotationVector.end);
        var line3D = new THREE.Line(lineGeo, material);

        // var ray = new THREE.Ray(group.vectorOffset, group.rotationVector.normalize()); //create the ray to compare with
        // get the distance of the closest point
        var rayClosest = line.closestPointToPoint(point);
        var rayDist = rayClosest.distanceTo(point);
       
        if (rayDist > 0.05){
          //get the closest point
          console.log(rayDist, rayClosest);
          //calculate if there was already an angle applied
          var yDestination = Math.tan(util.toRad(e.target.value)) * Math.sqrt( Math.pow( (point.x - rayClosest.x), 2) + Math.pow( (point.z - rayClosest.z), 2) );
          // console.log(e.target.value, point.x, point.z, rayClosest.x, rayClosest.z);
          // console.log(yDestination);
          // because JS is bad at math
          // TODO: Remove all unecessary Radian/Degree conversions
          // child.translateOnAxis(new THREE.Vector3(0,1,0), yDestination);
        }
      }
    });
  },

  verifyUp : function (e){
    var group = e.data.parent;
 
    var result = _.any(group.children, function (child){
      if (child.name === "sphere" && child.getWorldPosition().y > 20){
        return true;
      } else {
        return false;
      }
    });
    return result;
  }

});

