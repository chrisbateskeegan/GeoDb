var app = require('../app');
var mongoose = require('mongoose');
var models = require('../models');
var assert = require('assert');

describe('Database', function(){
    before(function(done){
	models.Location.nextLocationRef=1;

	var a = new models.Location({"gridRef": "SD647277", "location": "down the road"});
	var b = new models.Location({"gridRef": "SD648280", "location": "along the way"});
	var c = new models.Location({"gridRef": "SD840217", "location": "round the corner"});

    	models.Location.remove({}, function(){
    	    save([a,b,c], done);
    	});
    });

    describe('#find()', function(){
	it('should respond with matching records', function(done){
	    models.Location.find({}, function(err, res){
		if (err) return done(err);
        
		res.should.have.length(3);
		res[0].ref.should.equal(1);
		res[1].ref.should.equal(2);
		res[2].ref.should.equal(3);
        
		done();
	    });
	});
    });
    
    after(function(done) {
  	models.Location.remove({},done);  	
    });
});

function save(locs, fn) {
    var num = locs.length;
    
    locs.forEach(function(loc){
	loc.save(function(err){
	    if ( err ) {
		fn(err);
	    }
	    
	    if (--num == 0 ) {
		fn();
	    }
	});
    });
}