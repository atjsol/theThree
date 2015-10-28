var $ = require("jquery");
require("jquery-ui");
var THREE = require("three.js");
var _ = require("lodash");
var eventBus = require("../lib/eventBus");
var util = require("../lib/util");
var GeometryMaker = require("../lib/GeometryMaker");
var extrudeSettings = require("../lib/extrudeSettings");

var ObjectAttributeView = module.exports = function($el, parent) {
  _.bindAll(this);
  this.$el = $el;
  this.currentObject = {};
  this.parent = parent;
};


ObjectAttributeView.prototype = Object.create({
  toHtml: function(val, tag, clas) {
    function brackets(val) {
      return "<" + val + ">";
    }
    tag = tag || "div";
    clas = clas || "";
    return brackets(tag + " class=" + clas) + val + brackets("/" + tag);
  },


  addToInterface: function(objArray) {
    /* beautify preserve:start */
    /* jshint ignore:start */
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
    var header = _.template('<h3 class="attribute-list"> <%= name %> <button name="delete" class="delete" type="button" >Del</button> </h3> ');
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
        +'<label><input type="radio" name="type" data-actions="assignType setEaveVector" value="EAVE">Eave</label>'
        +'<label><input type="radio" name="type" data-actions="assignType" value="RIDGE">Ridge</label>'
        +'<label><input type="radio" name="type" data-actions="assignType" value="VALLEY">Valley</label>'
        +'<label><input type="radio" name="type" data-actions="assignType" value="HIP">Hip</label>'
        +'<label><input type="radio" name="type" data-actions="assignType" value="RAKE">Rake</label>'
        +'<label><input type="radio" name="type" data-actions="assignType" value="STEPFLASH">Stepflash</label>'
        +'<label><input type="radio" name="type" data-actions="assignType" value="FLASHING">Flashing</label>'
      );

      var compiledAttributes = attributes({});
      body+= compiledAttributes;

      var alignControls = '<h5>Alignment</h5>' +
        '<button class="alignButton">Align to Grid</button>';

      body += alignControls;
    }

    var position = _.template(
       '<h5>Position</h5>'
      +'<ul class="attribute-list">'
        +'<li> x : <input name="position setX" data-actions="setX" type="number" step="0.01" value="<%= x %>"</li>'
        +'<li> y (up) : <input name="position setY" data-actions="setY" type="number" step="0.01" value="<%= y %>"</li>'
        +'<li> z : <input name="position setZ" data-actions="setZ" type="number" step="0.01" value="<%= z %>"</li>'
      +'</ul>');
    var compiledPosition = position(someObj.getWorldPosition());
    body += compiledPosition;

    var dialog = _.template('<div id="dialog-confirm" title="<%= title %>">'
      + '<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span><%=  text %></p>'
      + '</div>');



    if (someObj.hasOwnProperty("planeRotation")){
      var rotation = _.template('<h5>Rotation</h5><ul class="attribute-list"><li><input type="number" name="updateRoataion" data-actions="updateRotation" val=<%= planeRotation %></li></ul>');
      var compiledRotation = rotation(someObj);
      body+=compiledRotation;
    }

    body=this.toHtml(body);
    this.$el.off();

    total = compiledHeader + body;

    this.closeAccordion();

    this.$el.append(total);
    if (this.currentObject.name === "cylinder"){
      this.$el.find("input[name='type'][ value='" + this.currentObject.constructionData.type + "']").prop("checked", true);
    }

    this.$el.on("click", ".delete", function (e){
      self.$el.append(dialog({title: "Delete Mounting Plane", text : "Are you sure you want to delete " + someObj.parent.name + "?" }));
      $( "#dialog-confirm" ).dialog({
        resizable: false,
        height:300,
        modal: true,
        buttons: {
          "Yes": function() {
            self.removeFromScene(someObj);
            $( this ).dialog( "close" );
          },
          Cancel: function() {
            $( this ).dialog( "close" );
          }
        }
      });
    });

    this.$el.on("click", ".alignButton", this.alignToGrid);

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
    /* beautify preserve:end */
    /* jshint ignore:end */
  },

  removeFromScene: function(sceneMember) {

    if (sceneMember && sceneMember.parent) {
      if (sceneMember && sceneMember.parent.type === "Scene") {

        // sceneMember.parent.remove(sceneMember);
        this.parent.tracingView.scene.remove(sceneMember);
      } else {
        this.removeFromScene(sceneMember.parent);
      }
    }
  },
  closeAccordion: function(e) {
    //remove any events
    if (this.$el.hasClass("ui-accordion")) {
      this.$el.accordion("destroy");
    }
    this.$el.off(); // remove all previous event handlers
    this.$el.empty();
  },

  assignType: function(e) {
    //set the linetype
    // e.target.value is where our the type is located
    // window.tracingView.job.structures[number].mountingPlanes[number].lines would be where a line exists
    this.currentObject.constructionData.type = e.target.value;
    eventBus.trigger("change:scene");
  },

  updateGroupModel: function(e) {
    var self = this;

    // e.data is where our passed in data (from $('change", data, callback)) resides
    // e.target is where the change has occurred
    // e.target.dataset.* can be used to add any additional info as needed (currently set at target.dataset.action="string")
    // var name = evnt.target.name.split(" ");
    var actions = e.target.dataset.actions;
    var actionArray = actions.split(" ");
    actionArray.forEach(function(action) {
      self[action](e);
    });
  },
  setX: function(e) {
    e.data.parent.position.setX(e.target.value);
  },
  setY: function(e) {
    e.data.parent.position.setY(e.target.value);
  },
  setZ: function(e) {
    e.data.parent.position.setZ(e.target.value);
  },

  setEaveVector: function(e) {
    //get the two points used to make the cylinder
    //subtract them from each other to get a resultant vector
    // normalize the vector because the set rotation is expecting normalized.
    if (this.currentObject) {
      var constructionData = this.currentObject.constructionData;
      var vector1 = constructionData.points[0].clone();
      var vector2 = constructionData.points[1].clone();
      var normalized = vector1.clone().sub(vector2).normalize();

      /*var parent = this.currentObject.parent;
      if (parent) {
        //sets the group level as holder of the rotation vector
        parent.rotationVector = {};
        parent.rotationVector.normal = normalized;
        parent.rotationVector.start = vector1;
        parent.rotationVector.end = vector2;
        parent.vectorOffset = vector2.clone();
        //TODO:  Ensure all other lines are not set as eave for this mounting plane
      }*/
    }
  },

  updateRotation: function(e) {
    //apply rotation to group
    // rebuild the group based on sphere positions
    // the plane will have to grow in proportion to the rotation i.e. create a new shape
    // the spheres will only rise in proportion to the supplied angle

    var group = e.data.parent;
    var shapePath = this.translatePointforRotation(e);

    var newOutline = new THREE.Shape();
    shapePath.forEach(function(point, i, array) {
      if (array.length > 2) {
        if (i === 0) {
          newOutline.moveTo(point.x, point.z);
        } else {
          newOutline.lineTo(point.x, point.z);
        }
      }
    });
    console.log(shapePath);
    var shape = GeometryMaker.addShape(newOutline, extrudeSettings, 0xf08000, 0, 20, 0, util.toRad(135), 0, 0, 1);
    shape.name = "mounting plane tilted";
    shape.position.add(group.getWorldPosition());
    group.add(shape);
    console.log(group);

  },

  translatePointforRotation: function(e) {
    var self = this;
    var group = e.data.parent;
    var newMountingPlanePath = [];
    var newShapePath = [];
    group.children.forEach(function(child) {
      if (child.name === "sphere") {

        var point = child.getWorldPosition();
        point.y = group.vectorOffset.y;

        var offset = group.vectorOffset.clone();
        var normal = group.rotationVector.normal.clone();

        offset.sub(normal.clone().setLength(2000));
        var ray = new THREE.Ray(offset, normal);


        // create the ray for comparisons
        // get the distance of the closest point
        var rayClosest = ray.closestPointToPoint(point);
        var rayDist = rayClosest.distanceTo(point);
        if (rayDist < 0.05) {
          newShapePath.push(point);
        } else {
          //allow for some error tolerence from calculations
          newShapePath.push(self.calcPathPoint(rayClosest, point, e.target.value));
          //get the closest point
          //calculate if there was already an angle applied
          var yDestination = Math.tan(util.toRad(e.target.value)) * Math.sqrt(Math.pow((point.x - rayClosest.x), 2) + Math.pow((point.z - rayClosest.z), 2));

          // TODO: Remove all unecessary Radian/Degree conversions
          child.position.setY(yDestination + group.vectorOffset.y);
        }
      }
    });
    return newShapePath;
  },
  calcPathPoint: function(closestPoint, point, degree) {
    var vector1 = closestPoint.clone();
    var vector2 = point.clone();
    var originVector = vector2.clone().sub(vector1);
    var distance = vector2.distanceTo(vector1);
    if (distance < 0.005) {
      return vector2;
    }
    var updatedDist = distance * Math.cos(util.toRad(degree));
    originVector.setLength(updatedDist);
    vector2.add(originVector);
    console.log(point, vector1);
    return vector2;


  },

  verifyUp: function(e) {
    var group = e.data.parent;

    var result = _.any(group.children, function(child) {
      if (child.name === "sphere" && child.getWorldPosition().y > 20) {
        return true;
      } else {
        return false;
      }
    });
    return result;
  },

  alignToGrid: function(e) {
    var currentObject = this.currentObject;
    if (currentObject && currentObject.constructionData && currentObject.constructionData.points) {
      var points = currentObject.constructionData.points;
      var a = points[0].clone();
      var b = points[1].clone();
      var c = a.sub(b).normalize();
      var theta = Math.atan2(c.x, c.z);
      this.parent.tracingView.align(theta);
    }
  }

});
