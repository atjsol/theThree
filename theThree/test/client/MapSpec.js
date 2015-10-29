(function () {
  var expect = chai.expect;
  var should = chai.should();
  var assert = chai.assert; 
 
    
  describe("Map", function() {
    describe("Initial size Calc", function (){

      var referenceMetersPerPixel =[156543.03,78271.52,39135.76,19567.88,9783.94,4891.97,2445.98,1222.99,611.50,305.75,152.87,76.437,38.219,19.109,9.5546,4.7773,2.3887,1.1943,0.5972];
      var angle = 0;
      referenceMetersPerPixel.forEach(scaleTest);
      function getScale (index){
        return 156543.04 * Math.cos(angle) / (Math.pow(2, index));
      }
      function scaleTest(value, index){
        it("Should calculate the same meters per pixel as a supplied chart", function (){
          expect(value).to.equal(getScale(index));
        });
      }

    });
  });

  
}());