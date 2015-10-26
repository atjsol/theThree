(function () {
  var expect = chai.expect;
  var should = chai.should();
  var assert = chai.assert; 
 
    
  describe("THREE", function() {
    describe("Line Methods", function (){
      var start = new THREE.Vector3(0,0,0);
      var end = new THREE.Vector3(0,0,1);
      var line1 = new THREE.Line3(start, end);
      var testPoint = new THREE.Vector3(1, 0, 0);
      it("Should provide correct distances for each point that is equidistant from the line", function() {
        expect(line1.closestPointToPoint(testPoint)).to.deep.equal(new THREE.Vector3(0,0,0));
        testPoint.set(1, 0, 1);
        expect(line1.closestPointToPoint(testPoint)).to.deep.equal(new THREE.Vector3(0,0,1));
        testPoint.set(0.5, 0, 0.5);
        expect(line1.closestPointToPoint(testPoint)).to.deep.equal(new THREE.Vector3(0,0,.5));
      });
    });

    describe("Ray Methods", function (){
      var origin; 
      var origin1; 
      var origin2; 
      var vector; 
      var vector1; 
      var vector2; 
      var offset; 
      var ray1; 
      var ray2; 
      var testPoint;
      origin = new THREE.Vector3(0,0,0);
      vector = new THREE.Vector3(0,0,1);
      ray1 = new THREE.Ray(origin, vector);
      testPoint = new THREE.Vector3(1, 0, 0);
      it("Should provide correct distances for each point that is equidistant from the ray", function() {
        expect(ray1.closestPointToPoint(testPoint)).to.deep.equal(new THREE.Vector3(0,0,0));
        testPoint.set(1, 0, 1);
        expect(ray1.closestPointToPoint(testPoint)).to.deep.equal(new THREE.Vector3(0,0,1));
        testPoint.set(0.5, 0, 5.5);
        expect(ray1.closestPointToPoint(testPoint)).to.deep.equal(new THREE.Vector3(0,0,5.5));
        testPoint.set(0.5, 0, -5.5);
        // expect(ray1.closestPointToPoint(testPoint)).to.deep.equal(new THREE.Vector3(0,0,-5.5));
        ray1.direction.negate();
        expect(ray1.closestPointToPoint(testPoint)).to.deep.equal(new THREE.Vector3(0,0,-5.5));
      });

      it("Should provide correct distance for each point that is equidistant if the ray is offset", function(){


        expect(ray1.closestPointToPoint(testPoint)).to.deep.equal(ray2.closestPointToPoint(testPoint));
        


      });
        origin1 = new THREE.Vector3(0,0,0);
        vector1 = new THREE.Vector3(1,1,1).normalize();
        ray1 = new THREE.Ray(origin1, vector1);
        origin2 = new THREE.Vector3(0,0,0);
        vector2 = new THREE.Vector3(1,1,1).normalize();
        offset = vector2.setLength(2000);

        origin2.sub(offset);
        ray2 = new THREE.Ray(origin2, vector1);
        console.log(ray1.closestPointToPoint(testPoint));
        console.log(ray2.closestPointToPoint(testPoint));






    });

    describe("Vector Methods", function (){
      var vector1 = new THREE.Vector3(0,0,1);

      it("Should scale a normalized vector to the length specified", function (){
        expect(vector1.multiplyScalar(10)).to.deep.equal(new THREE.Vector3(0,0,10));
        vector1.set(1,1,1);
        expect(vector1.multiplyScalar(10)).to.deep.equal(new THREE.Vector3(10,10,10));
      });
      it("Should subtract vectors", function (){
        vector1.set(5,5,5);
        vector1.sub(new THREE.Vector3(1,1,1));
        expect(vector1).to.deep.equal(new THREE.Vector3(4,4,4));
      });




    });
  });
  
}());