exports.buildMapUrl = function(mapObj) {
  //A promise is used because encodeURIComponent is not synchronous.
  mapObj = mapObj || {};
  mapObj.center = mapObj.center || "38 Rio Vista Ave,Oakland, CA 94611";

  //set defaults based on what is inputted
  //initialize map object if none exists

  mapObj.size = mapObj.size || "200x200";
  mapObj.scale = mapObj.scale || 2;
  mapObj.key = mapObj.key || "AIzaSyBxxi5-bG4cnbPDPwZw0LfgSNzpPFOHs5E";
  mapObj.maptype = mapObj.maptype || "satellite";
  mapObj.format = mapObj.format || "png";
  mapObj.urll = mapObj.urll || "https://maps.googleapis.com/maps/api/staticmap";
  mapObj.zoom = mapObj.zoom || 18;

  //build the query
  var urlQuery = Object.getOwnPropertyNames(mapObj).reduce(function(queryString, property) {

    //initialize the query string if it does not exist
    if (property === "urll") {
      return mapObj[property] + "?" + queryString;
    }
    return queryString + "&" + property + "=" + mapObj[property];
  }, "");
  return urlQuery;
};
