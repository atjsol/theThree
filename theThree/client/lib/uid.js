var ids = new Map();
var crypto = require("crypto");

module.exports = {
  random: function() {
    return crypto.randomBytes(4).toString("hex");
  },

  incremental: function(prefix) {
    var id = 0;
    if (ids.has(prefix)) {
      id = ids.get(prefix);
      id++;
    }
    ids.set(prefix, id);
    return id;
  }
};
