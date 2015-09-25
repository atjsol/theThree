document.addEventListener("DOMContentLoaded", function(event) { 

});


function loadMap(mapObj) {
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
    }).then(function (val) {
        return val;
    }).then(function (val){
        console.log("loadmap ",val);
        loadImage(val);

    });	    
}

function loadImage(path) {
    var canvas = document.createElement('canvas');
   
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width ='256px';
    canvas.style.height = '256px';
    document.body.appendChild(canvas);

    var texture = new THREE.Texture(canvas);
var planeXY = new THREE.PlaneGeometry(256, 256, 2);
    var img = new Image();
    img.src = path;
    img.crossOrigin = ''
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        console.dir(img);
        var context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);

        texture.needsUpdate = true;
        texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 4, 4 );
    var material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture })

    var plane = new THREE.Mesh(planeXY, material);
    plane.rotation.set(toRad(90), 0, 0);

    scene.add(plane);
    };
    console.log(texture);


    return texture;
};

var path = loadMap();
console.log(path);
var theMap;


 //"http://maps.googleapis.com/maps/api/staticmap?center=39.06029101581083,-94.59737342812502&zoom=15&size=512x512&sensor=false&key=AIzaSyDk3wbT2nVVWhpmPjOb_3DbtrIQBXcsxtk&format=png";
// var theMap = loadImage(path);
// var geometry = new THREE.PlaneGeometry(200, 200);
// var material = new THREE.MeshLambertMaterial({ map: theMap });
// var plane = new THREE.Mesh(geometry, material);
// scene.add(plane);
