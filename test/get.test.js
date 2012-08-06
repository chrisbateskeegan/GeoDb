var mongoose = require('mongoose');
var models = require('../models');
var app = require('../app');
var http = require('http');
var should = require('should');

describe('Model', function(){
    before(function(done){
	models.Location.nextLocationRef=1;

	var a = new models.Location({"gridRef": "SD647277", "location": "down the road"});
	var b = new models.Location({"gridRef": "SD648280", "location": "along the way"});
	var c = new models.Location({"gridRef": "SD840217", "location": "round the corner"});

    	models.Location.remove({}, function(){
    	    save([a,b,c], done);
    	});
    });

    describe('List', function(){
	it('should contain three locations: SD647277, SD648280 & SD840217', function(done){
	    testLocationGet('/locations.json', function(response){
		var res=JSON.parse(response);
		res.should.have.length(3);
		res[0].ref.should.equal(1);
		res[1].ref.should.equal(2);
		res[2].ref.should.equal(3);
		res[0].gridRef.should.equal('SD647277');
		res[1].gridRef.should.equal('SD648280');
		res[2].gridRef.should.equal('SD840217');
		
		done();
	    });
	});
    });

    describe('Location Detail', function(){
	it('should show details for location ref 1 (SD647277)', function(done){
	    testLocationGet('/location/1.json', function(response){
		var res=JSON.parse(response);
		res.error.should.equal(false);
		res.ref.should.equal(1);
		res.gridRef.should.equal('SD647277');
		
		done();
	    });
	});
    });

    describe('Search', function(){
	it('should find a valid location (SD840217) when searching within 0.5km of SD844218', function(done){
	    testLocationGet('/locations/query/SD844218/?radius=0.5', function(response){
		var res=JSON.parse(response);
		res.should.have.length(1);
		res[0].gridRef.should.equal('SD840217');
		
		done();
	    });
	});
    });

    describe('Search', function(){
	it('should find a no locations when searching within 0.5km of SD778307', function(done){
	    testLocationGet('/locations/query/SD778307/?radius=0.5', function(response){
		var res=JSON.parse(response);
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

function testLocationGet(url,fn) {
    var req = http.request({
	host: 'localhost',
	path: url,
	port: app.set('port'),
	method: 'GET',
	headers: {}
    }, function(res) {
	res.setEncoding('utf8');
	res.should.have.status(200);
	res.should.be.json;
	res.on('data', fn);
    });
    
    req.on('error', function(e) {
	should.fail('GET failed: ' + e.message);
    });    	
    
    req.end();
}