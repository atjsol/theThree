var _ = require("lodash");

module.exports = {
  // has: function(key) {
  // 	return new Promise(function(reject, resolve) {
  // 		var item = localStorage.getItem(key);
  // 		return !_.isUndefined(item);
  // 	});
  // },

  get: function(key) {
    return new Promise(function(resolve, reject) {
      var item = localStorage.getItem(key);
      return item ? resolve(item) : reject("No storage at key");
    }).then(function(item) {
      return (new Response(item)).json();
    });
  },

  set: function(key, model) {
    return Promise.resolve(JSON.stringify(model)).then(function(item) {
      localStorage.setItem(key, item);
      return model;
    });
  }
};
