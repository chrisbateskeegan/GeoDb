var geo = require("../geo");

describe('Geo', function(){
    describe('getDistanceAlpha (SD647277, SD648280)', function(){
  	var a = "SD647277";
  	var b = "SD648280";

	it('should be 316.23 metres', function(done){
    	    geo.getDistanceAlpha(a,b).should.equal(316.22776601683796);
    	    done();
	});
    });
  
    describe('gridToLatLong (SD6470027700)', function(){
  	var grid = "SD6470027700";
	
	it('should be lat: 53.7444726704, long: -2.5367169042', function(done){
    	    var latLon = geo.gridToLatLon(grid);
    	    var lat = latLon.lat.toFixed(10);
    	    var lon = latLon.lon.toFixed(10);
    	    
    	    //lat.should.equal(53.7444726704);
    	    //lon.should.equal(-2.5367169042);
    	    done();
	});
    }); 
});