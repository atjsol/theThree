//point cloud grouping 
// function pcgroup(points) {
//     //create group
//     //add points to group
//     //make mesh
//     //add listeners to group for rotation

//     //create new group
//     //add points to group
//     //make mesh
//     //add listeners to group for rotation

//     var particles = 500000;

//     var geometry = new THREE.BufferGeometry();

//     var positions = new Float32Array(particles * 3);
//     var colors = new Float32Array(particles * 3);

//     var color = new THREE.Color();

//     var group = new THREE.Object3D();
//     var n=200
//     for (var i = 0; i < positions.length; i += 3) {

//         // positions

//         var x = Math.random() * n - n/2;
//         var y = Math.random() * n - n/2;
//         var z = Math.random() * n - n/2;

//         positions[i] = x;
//         positions[i + 1] = y;
//         positions[i + 2] = z;

//         // colors

//         var vx = (x / n) + 0.5;
//         var vy = (y / n) + 0.5;
//         var vz = (z / n) + 0.5;

//         color.setRGB(vx, vy, vz);

//         colors[i] = color.r;
//         colors[i + 1] = color.g;
//         colors[i + 2] = color.b;

//     }
//     geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
//     geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

//     group.add(geometry)
//     scene.add(group);
// };


// function randomShape (sides){
//   for (var i =0; i < sides; i++){
//     outlinePoints.push( new THREE.Vector2(Math.random()*100, Math.random()*100))
//   }
// }

// randomShape(8);