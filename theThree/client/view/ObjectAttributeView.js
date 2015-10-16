var $ = require("jquery");
require("jquery-ui");
var _ = require("lodash");
var eventBus = require("../lib/eventBus");


var ObjectAttributeView = module.exports = function($el) {
  _.bindAll(this);
  this.$el = $el;
  

};

ObjectAttributeView.prototype = Object.create({
  addToInterface:function (objArray){
    //expecting an array of objects to dynamically add to the interface
    // this.$el.empty();

    console.log(objArray);
    var total = ""; 
    objArray.forEach(function(object){
      var object = object.object;
      //create header by object name
      total+="<h3>"+object.name+"</h3>";
      total+="<div>";
      // create object data properties
      for (var prop in object){
        if (typeof object[prop] !== "function"  && object[prop])
        total+="<div>"+prop+" : "+object[prop]+"</div>";
      }
      total+="</div>"

    });
    this.$el.append(total);
    console.log(this.$el)
    this.$el.accordion({
      collapsible:true,
      heightstyle:"content",
      
    });

  }

 

});

