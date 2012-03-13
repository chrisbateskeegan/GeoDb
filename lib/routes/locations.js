var mongoose 	= require('mongoose')
	,	geo 			= require("../geo")
	,	app 			= require("../../app");

/*
 * Locations Routes
 * 
*/

exports.list = function(req,res){
	var Location = mongoose.model('Location');
	
	Location.find({}, function(err,locs){
    res.send(locs.map(function(l) {
      var latLong = geo.gridToLatLong(l.gridRef);
      return {ref: l.ref, gridRef: l.gridRef, lat: latLong.lat, long: latLong.long, location: l.location};
    }));
  });
};

exports.queryGridReference = function(req,res){
	var Location = mongoose.model('Location');
  var gridRef = req.params[0] + req.params[1];

  Location.search(gridRef, req.query.radius, function(err, locs){
  	if ( err != false ) {
  		res.send({"error": true});
  	} else{
    	res.send(locs);
  	}
  });
};

//////////////////////////////////////////////////

exports.create = function(req,res){
	var Location = mongoose.model("Location");
	var gridRef = req.body.gridRef;
	var location = req.body.location;
	
	Location.search( gridRef, req.query.radius, function(err,locs) {
		if ( err != false ) {
			res.send( {"error": true} );
		}
		
		if ( locs.length != 0 ) {
			res.send({ "error": false, "result": false, "locs": locs });
		} else{
			var loc = new Location({"gridReference": gridRef, "location": location});
			loc.save( function(err){
				res.send({ "error": false, "result": true, "ref": loc.ref });
			} );
		}
  });	
	
};

//////////////////////////////////////////////////

exports.readLocation = function(req,res){
	var Location = mongoose.model('Location');
	Location.findOne({ref:req.params.id}, function(err,l){
    if ( l != null ) {
      var latLong = geo.gridToLatLong(l.gridRef);
      res.send({error: false, ref: l.ref, gridRef: l.gridRef, lat: latLong.lat, long: latLong.long, location: l.location});
    } else {
      res.send({error: true, ref: req.params.id, gridRef: ""});
    }
  });
};

//////////////////////////////////////////////////

exports.updateLocation = function(req,res){
};

//////////////////////////////////////////////////

exports.deleteLocation = function(req,res){
};

//////////////////////////////////////////////////

