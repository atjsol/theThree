document.addEventListener("DOMContentLoaded", function(event) { 

});


function loadMap(mapObj) {
    //A promise is used because encodeURIComponent is not synchronous.
    mapObj = mapObj || {};
    mapObj.center = mapObj.center || "444 De Haro, San Francisco, Ca";        

    //set defaults based on what is inputted
    //initialize map object if none exists

    mapObj.size = mapObj.size || "200x200";
    mapObj.scale =  mapObj.scale || 2;
    mapObj.key =  mapObj.key || "AIzaSyBxxi5-bG4cnbPDPwZw0LfgSNzpPFOHs5E";
    mapObj.maptype =  mapObj.maptype || "satellite";
    mapObj.format = mapObj.format || 'png';
    mapObj.urll = mapObj.urll || "https://maps.googleapis.com/maps/api/staticmap";
    mapObj.zoom =  mapObj.zoom || 18;

    
    var promise = new Promise(function (resolve, reject) {
        resolve(encodeURIComponent(mapObj.center));
        reject(function(){
            console.log("Promoise REJECTED LOADMAP")
        });
    });

    promise.then(function (val) {
        
        
        //build the query
        var urlQuery = Object.getOwnPropertyNames(mapObj).reduce(function (queryString, property) {
            
            //initialize the query string if it does not exist
            if (property === 'urll') {
                return mapObj[property] + '?' + queryString;
            }
            return queryString + '&' + property + '=' + mapObj[property];
        }, '');
        return urlQuery;

    }).then(function (val){
        loadImage(val);
    });	    
}

function loadImage(path) {
    var canvas = document.createElement('canvas');
    //render this canvas offscreen
    canvas.style.position = 'absolute';
    canvas.style.top = '-9990';
    canvas.style.left = '0';
    canvas.style.width ='200px';
    canvas.style.height = '200px';
    document.body.appendChild(canvas);
    var context = canvas.getContext('2d');
    var planeXY = new THREE.PlaneGeometry(200, 200, 4);

    
    var img = new Image();
    //this cross origin thing is huge, needs to be set before the img.src is set- if this is not set the canvas will be dirty and webGL will give us a bunch of errors
    img.crossOrigin = '';
    img.src = path;
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        
        context.drawImage(img, 0, 0);
      
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        texture.minFilter = THREE.LinearFilter;
        // texture.wrapS = THREE.RepeatWrapping;
        // texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 1, 1 );
        var material = new THREE.MeshBasicMaterial({  map: texture });
        var plane = new THREE.Mesh(planeXY, material);
        plane.rotation.set(toRad(-90), 0, 0);
        plane.name = "map";
        scene.add(plane);
    };
   


    
};

loadMap();
