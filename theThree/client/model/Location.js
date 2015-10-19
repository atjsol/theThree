var Location = module.exports = function(address) {
  this.address = address;
};

Location.prototype = Object.create({});

Location.fromAddressString = function(address) {
  var location = new Location(address);
  // TODO: parse adress for city, state, zip and fetch latitude/longitude
  return location;
};
