var $ = require("jquery");
var _ = require("lodash");
var eventBus = require("../lib/eventBus");
var urlBuilder = require("../lib/urlBuilder");
var util = require("../lib/util");

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

    this.calcMapScale(mapObj);
    eventBus.trigger("change:map", mapObj);
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
        var angle = util.toRad(latitude); 
        //256 is based on tile size - 

        //equator length (circumfrence) = 40075.016686km * 1000m/km / 256 tiles
        // (pixels per tile at zoom 0)

        var scale = 1/100 * size/2 * 156543.04 * Math.cos(angle) / (Math.pow(2, zoom) );
        window.tracingView.scene.scale.map = scale;

      })
      .fail(function(error) {
      console.log("calcMapScale fail", error);
    });
    return;

    
  }
});


