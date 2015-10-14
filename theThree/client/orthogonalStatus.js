var microevent = require('microevent');
var _ = require('lodash')
module.exports = {
  status : true,
  getStatus : function (){
    return this.status;
  },
  setStatus : function (state){
    this.status = state;
    this.trigger("change:status");
  }, 
  invertStatus : function () {
    this.setStatus(!this.status);
  }
}

_.extend(module.exports, microevent.prototype);


