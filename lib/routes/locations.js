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
		res.header('Cache-Control', 'no-cache');
    res.send(locs.map(function(l) {
      var latLon = geo.gridToLatLon(l.gridRef);
      return {ref: l.ref, gridRef: l.gridRef, lat: latLon.lat, lon: latLon.lon, location: l.location};
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
	var radius = req.body.radius || 0.1;
	
	var gridRefRegEx = /(([a-zA-Z]{2})(([0-9]{2})|([0-9]{4})|([0-9]{6})|([0-9]{8})|([0-9]{10})))/;
	var gridRefTest = gridRefRegEx.test(gridRef);
	
	if ( gridRefTest == false ) {
		res.send({"error": true});
		return;
	}
	
	Location.search( gridRef, radius, function(err,locs) {
		if ( err != false ) {
			res.send( {"error": true} );
		}
		
		if ( locs.length != 0 ) {
			res.send({ "error": false, "result": false, "locs": locs });
		} else{
			var loc = new Location({"gridRef": gridRef, "location": location});
			loc.save( function(err){
				res.send({ "error": false, "result": true, "ref": loc.ref });
			});
		}
  });	
};

//////////////////////////////////////////////////

exports.readLocation = function(req,res){
	var Location = mongoose.model('Location');
	Location.findOne({ref:req.params.id}, function(err,l){
    if ( l != null ) {
      var latLon = geo.gridToLatLon(l.gridRef);
      res.send({error: false, ref: l.ref, gridRef: l.gridRef, lat: latLon.lat, lon: latLon.lon, location: l.location});
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

