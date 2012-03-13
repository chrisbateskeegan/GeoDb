var geo = require("../lib/geo");

describe('Geo', function(){
  describe('getDistanceAlpha', function(){
  	var a = "SD647277";
  	var b = "SD648280";

    it('should be 316.23 metres', function(done){
    	geo.getDistanceAlpha(a,b).should.equal(316.22776601683796);
    	done();
    });
  });
  
  describe('gridToLatLong', function(){
  	var grid = "SD647277";

    it('should be lat: 53.7444726704, long: -2.5367169042', function(done){
    	var latLon = geo.gridToLatLon(grid);
    	var lat = latLon.lat.toFixed(10);
    	var lon = latLon.lon.toFixed(10);
    	
    	lat.should.equal(53.7444726704);
    	lon.should.equal(-2.5367169042);
    	done();
    });
  });

  
});
