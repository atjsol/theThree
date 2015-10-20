var $ = require("jquery");
require("jquery-ui");
var _ = require("lodash");
var eventBus = require("../lib/eventBus");
var util = require("../lib/util");

var ObjectAttributeView = module.exports = function($el) {
  _.bindAll(this);
  this.$el = $el;
};

ObjectAttributeView.prototype = Object.create({
  toHtml : function (val, tag, clas){
    function brackets (val){
      return "<"+val+">";
    }
    tag = tag || "div";
    clas = clas || "" 
    return brackets(tag + ' class='+ clas )+val+brackets("/"+tag);
  }, 

  addToInterface:function (objArray){
    var self = this;
    //ignore things we do not care about - things we created
    var ignore = ["map", "grid", "Orthographic Camera", "cursor", "lineV", "lineH"];
    var ignoreObj = util.arrToObj(ignore);
    if (objArray.length === 0 || ignoreObj[objArray[0].object.name]) return;
    //expecting an array of objects
    //only choose the first item
    var someObj = objArray[0].object;
    
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

      var length = someObj.constructionData[0].distanceTo(someObj.constructionData[1]);

      compiledDistance = distance({length:length}); 

      body+=compiledDistance;

      var attributes = _.template('<h5>Attributes</h5>'
        +'<input type="radio" name="attribute" value="Eave">Eave'
        +'<input type="radio" name="attribute" value="Ridge">Ridge'
        +'<input type="radio" name="attribute" value="Valley">Valley'
        +'<input type="radio" name="attribute" value="Hip">Hip'
      );
      body+= attributes({});

    }
    var position = _.template(
       '<h5>Position</h5>'
      +'<ul class="attribute-list">'
        +'<li> x : <input name="x" type="number" step="0.01" value="<%= x %>"</li>'
        +'<li> y (up) : <input name="y" type="number" step="0.01" value="<%= y %>"</li>'
        +'<li> z : <input name="z" type="number" step="0.01" value="<%= z %>"</li>'
      +'</ul>');
    var compiledPosition = position(someObj.position);
    body += compiledPosition;
    
    if (someObj.hasOwnProperty("planeRotation")){
      var rotation = _.template('<h5>Rotation</h5><ul class="attribute-list"><li><input val=0></li></ul>');
      var compiledRotation = rotation(someObj.planeRotation); 
      body+=compiledRotation;
    } 

    

    body=this.toHtml(body);
    
    total = compiledHeader + body;

    if (this.$el.hasClass("ui-accordion")){
      this.$el.accordion("destroy"); 
    }
    this.$el.empty();

    this.$el.append(total);
    this.$el.accordion({
      collapsible:true,
      heightstyle:"content",
    });
  }
});

