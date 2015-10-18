var $ = require("jquery");
require("jquery-ui");
var _ = require("lodash");
var eventBus = require("../lib/eventBus");


var ObjectAttributeView = module.exports = function($el) {
  _.bindAll(this);
  this.$el = $el;

  

};

ObjectAttributeView.prototype = Object.create({
  toHtml : function (val, tag){
    function brackets (val){
      return "<"+val+">";
    }
    tag = tag || "div";
    return brackets(tag)+val+brackets("/"+tag);
  }, 

  addToInterface:function (objArray){
    var self = this;
    //expecting an array of objects to dynamically add to the interface
    console.log(objArray);
    var total = objArray.map(function(object){
      var head = "";
      var body = ""; 
      var object = object.object;
      //create header by object name
      head+="<h3>"+object.name+"</h3>";
      var position = "Position"+'<ul><li> x : <input type="number" val=object.position.x></li>'+'<li> y : <input type="number" val=object.position.y></li>'+'<li> z : <input type="number" val=object.position.z></li></ul>';
      var rotation = "Rotation along eave axis"+"<input val=0>";
      var attributes = "Attributes";
      
      body += self.addDivs(position);
      body += self.addDivs(rotation);
      body += self.addDivs(attributes);

      // create object data properties - get all the properties
      // for (var prop in object){
      //   total+="<div>"+prop+" : "+object[prop]+"</div>";
      // }




      // add the final set of divs
      body+= self.addDivs(body);
      
      return head + body;


    }).join("");



    if (this.$el.hasClass("ui-accordion")){
      this.$el.accordion("destroy"); 
    }
    this.$el.empty();
    this.$el.append(total);
    console.log(this.$el)
    this.$el.accordion({
      collapsible:true,
      heightstyle:"content",
      
    });

  }

 

});

