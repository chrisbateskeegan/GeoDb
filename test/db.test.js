var app = require('../app')
	,	mongoose = require('mongoose');

describe('Database', function(){
	var Location = mongoose.model('Location')
    , a = new Location({"gridRef": "SD647277", "location": "down the road"})
    , b = new Location({"gridRef": "SD648280", "location": "along the way"})
    , c = new Location({"gridRef": "SD840217", "location": "round the corner"});

  before(function(done){
    Location.count(function(v){
    	Location.nextLocationRef = v+1;
    	
    	Location.remove({}, function(){
    		save([a,b,c], done);
    	});
    });
  });

  describe('#find()', function(){
    it('respond with matching records', function(done){
      Location.find({}, function(err, res){
        if (err) return done(err);
        
        res.should.have.length(3);
        parseInt(res[0].ref).should.equal(1);
        parseInt(res[1].ref).should.equal(2);
        parseInt(res[2].ref).should.equal(3);
        
        done();
      });
    });
  });
  
  after(function(done) {
  	Location.remove({},done);  	
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