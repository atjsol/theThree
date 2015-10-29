var $ = require("jquery");
var _ = require("lodash");
var eventBus = require("../lib/eventBus");
var urlBuilder = require("../lib/urlBuilder");

var MapControlsView = module.exports = function($el) {
  _.bindAll(this);
  this.$el = $el;

  $el.change(this.handleFormChange);
  $el.on("keyup keydown", function(event) {
    event.stopPropagation();
  });
  $el.on("submit", function(event) {
    event.preventDefault();
    event.stopPropagation();
  });
};

MapControlsView.prototype = Object.create({
  handleFormChange: function(val) {
    var mapObj = {};
    $("#mapData").children().each(function(val) {
      mapObj[this.name] = this.value;
    });

    eventBus.trigger("change:map", mapObj);
    this.calcMapScale(mapObj);
  },
  calcMapScale: function (mapObj){
    // Map resolution = 156543.04 meters/pixel * cos(latitude) / (2 ^ zoomlevel)
    // calculates meters per pixel
    var size = parseInt(mapObj.size.split("x")[0]);
    var urll = urlBuilder.buildGeocodeUrl(mapObj);
    $.ajax( urll )
      .done(function(val) {
        var zoom = mapObj.zoom;
        var latitude = parseFloat(val.results[0].geometry.location.lat);
        var angle = latitude * (Math.PI/180); 
        //256 is based on tile size - 
        var scale =  156543.04 * Math.cos(angle) / (Math.pow(2, zoom)) * (256/size);
        console.log(scale);
      })
      .fail(function(error) {
      console.log("calcMapScale fail", error);
    });
    return;

    
  }
});


