document.addEventListener("DOMContentLoaded", function(event) { 

});


function loadMap(mapObj) {
    //A promise is used because encodeURIComponent is not synchronous.
    var promise = new Promise(function (resolve, reject) {
        resolve(encodeURIComponent("500 Vernon St, oakland, ca"));
        reject(function(){
            console.log("Promoise REJECTED LOADMAP")
        });
    });

    promise.then(function (val) {
        console.log(val);
        //set defaults based on what is inputted
        //initialize map object if none exists
        mapObj = mapObj ? mapObj : {};
        mapObj.center = mapObj.hasOwnProperty('center') ? encodeURICompoent(mapObj.address) : val;        
        mapObj.size = mapObj.hasOwnProperty('size') ? mapObj.size : "512x512";
        mapObj.scale = mapObj.hasOwnProperty('scale') ? mapObj.scale : 2;
        mapObj.key = mapObj.hasOwnProperty('key') ? mapObj.key : "AIzaSyBxxi5-bG4cnbPDPwZw0LfgSNzpPFOHs5E";
        mapObj.maptype = mapObj.hasOwnProperty('maptype') ? mapObj.maptype : "satellite";
        mapObj.format = mapObj.hasOwnProperty('format') ? mapObj.format : 'png';
        mapObj.urll = mapObj.hasOwnProperty('urll') ? mapObj.urll : "https://maps.googleapis.com/maps/api/staticmap";
        mapObj.zoom = mapObj.hasOwnProperty('zoom') ? mapObj.zoom : 20;
        
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
    canvas.style.width ='800px';
    canvas.style.height = '800px';
    document.body.appendChild(canvas);

    
    var planeXY = new THREE.PlaneGeometry(200, 200, 2);
    var img = new Image();
    //this cross origin thing is huge - if this is not set the canvas will be dirty and webGL will give us a bunch of errors
    img.crossOrigin = '';
    img.src = path;
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        
        var context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
      
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 4, 4 );
        var material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture })

        var plane = new THREE.Mesh(planeXY, material);
        plane.rotation.set(toRad(90), 0, 0);

        scene.add(plane);
    };
   


    
};

loadMap();
