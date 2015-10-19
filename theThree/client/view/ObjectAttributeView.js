var $ = require("jquery");
require("jquery-ui");
var _ = require("lodash");
var eventBus = require("../lib/eventBus");


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

    //only choose the first item
    if (objArray.length === 0) return;
    
    var someObj = objArray[0].object;
    
    //expecting an array of objects to dynamically add to the interface
    var total ="";
    //create header by object name

    var header = _.template('<h3 class="attribute-list"> <%= name %> </h3>');
    var compiledHeader = header(someObj)
    var position = _.template(
       '<h5>Position</h5>'
      +'<ul class="attribute-list">'
        +'<li> x : <input name="x" type="number" step="0.01" value="<%= x %>"</li>'
        +'<li> y (up) : <input name="y" type="number" step="0.01" value="<%= y %>"</li>'
        +'<li> z : <input name="z" type="number" step="0.01" value="<%= z %>"</li>'
      +'</ul>');
    var compiledPosition = position(someObj.position);
    
    if (someObj.hasOwnProperty("planeRotation")){
      var rotation = _.template('<h5>Rotation</h5><ul class="attribute-list"><li><input val=0></li></ul>');
      var compiledRotation = rotation(someObj.planeRotation); 
    } 

    var attributes = 'Attributes';
    
    body = self.toHtml(compiledPosition + compiledRotation + attributes);

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

