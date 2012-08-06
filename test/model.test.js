var mongoose = require('mongoose');
var models = require('../models');
var app = require('../app');

describe('Model', function(){
    before(function(done){
	var a = new models.Location({"gridRef": "SD647277", "location": "down the road"});
	var b = new models.Location({"gridRef": "SD648280", "location": "along the way"});
	var c = new models.Location({"gridRef": "SD840217", "location": "round the corner"});

    	models.Location.remove({}, function(){
    	    save([a,b,c], done);
    	});
    });

    describe('Model', function(){
	it('should contain three locations: SD647277, SD648280 & SD840217', function(done){
	    models.Location.find({}, function(err, res){
		if (err) return done(err);
		
		res.should.have.length(3);
		res[0].gridRef.should.equal('SD647277');
		res[1].gridRef.should.equal('SD648280');
		res[2].gridRef.should.equal('SD840217');
		
		done();
	    });
	});
    });

    describe('Search', function(){
	it('should find a valid location (SD840217) when searching within 0.5km of SD844218', function(done){
	    models.Location.search('SD844218', 0.5, function(err,res){
		err.should.equal(false);
		res.should.have.length(1);
		res[0].gridRef.should.equal('SD840217');
		done();
	    });
	});
    });

    describe('Search', function(){
	it('should find a no locations when searching within 0.5km of SD778307', function(done){
	    models.Location.search('SD778307', 0.5, function(err,res){
		err.should.equal(false);
		res.should.have.length(0);
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