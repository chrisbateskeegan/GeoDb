var http = require('http');
var mongoose = require('mongoose');
var models = require('../models');
var app = require('../app');

describe('PUT', function(){
  before(function(done){
    models.Location.nextLocationRef=1;

    var a = new models.Location({"gridRef": "SD647277", "location": "down the road"});
    var b = new models.Location({"gridRef": "SD648280", "location": "along the way"});
    var c = new models.Location({"gridRef": "SD840217", "location": "round the corner"});

    models.Location.remove({}, function(){
      save([a,b,c], done);
    });
  });

  describe('Update', function(){
    it('should change location:1 gridReference from SD647277 to SD123123', function(done){
      testLocationPut(1,"gridRef=SD123123&location=changed the location", function(data) {
    	var response = JSON.parse(data);
    	response.error.should.equal(false);
  	
  	models.Location.find({ref: 1}, function(err, locs){
  	  if (err) return done(err);
  	  
  	  locs.should.have.length(1);
  	  locs[0].ref.should.equal(1);
  	  locs[0].gridRef.should.equal("SD123123");
  	  locs[0].location.should.equal("changed the location");
  	  
  	  done();
  	});
      });
    });
  });

  describe('Update', function(){
    it('should fail to change location:4 because it doesn\'t exist', function(done){
      testLocationPut(4,"gridRef=SD123123&location=failed to change the location", function(data) {
    	var response = JSON.parse(data);
    	response.error.should.equal(true);
  	
  	models.Location.find({ref: 4}, function(err, locs){
  	  if (err) return done(err);
  	  
  	  locs.should.have.length(0);
  	  
  	  done();
  	});
      });
    });
  });

  describe('Update', function(){
    it('should fail to change location:2 gridReference from SD648280 to SD840217 because a location already exists there', function(done){
      testLocationPut(2,"gridRef=SD840217&location=already a sett here", function(data) {
    	var response = JSON.parse(data);
    	response.error.should.equal(true);
  	
  	models.Location.find({ref: 2}, function(err, locs){
  	  if (err) return done(err);
  	  
  	  locs.should.have.length(1);
	  locs[0].gridRef.should.equal('SD648280');
  	  
  	  done();
  	});
      });
    });
  });

  describe('Update', function(){
    it('should update location:3 location from \'round the corner\' to \'just round the corner\' ', function(done){
      testLocationPut(3,"location=just round the corner", function(data) {
    	var response = JSON.parse(data);
    	response.error.should.equal(false);
  	
  	models.Location.find({ref: 3}, function(err, locs){
  	  if (err) return done(err);
  	  
  	  locs.should.have.length(1);
	  locs[0].gridRef.should.equal('SD840217');
	  locs[0].location.should.equal('just round the corner');
  	  
  	  done();
  	});
      });
    });
  });

  describe('Update', function(){
    it('should update location:3 gridReference from SD840217 to SD840218 without updating the location ', function(done){
      testLocationPut(3,"gridRef=SD840218", function(data) {
    	var response = JSON.parse(data);
    	response.error.should.equal(false);
  	
  	models.Location.find({ref: 3}, function(err, locs){
  	  if (err) return done(err);
  	  
  	  locs.should.have.length(1);
	  locs[0].gridRef.should.equal('SD840218');
	  locs[0].location.should.equal('just round the corner');
  	  
  	  done();
  	});
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

function testLocationPut(ref,params,fn) {
  var req = http.request({
    host: 'localhost',
    path: '/locations/'+ref,
    port: app.set('port'),
    method: 'PUT',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }, function(res) {
    res.setEncoding('utf8');
    res.should.have.status(200);
    res.should.be.json;
    res.on('data', fn);
  });
  
  req.on('error', function(e) {
    should.fail('PUT failed: ' + e.message);
  });    	
  
  req.write(params);
  req.end();
}