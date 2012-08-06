var mongoose 	= require('mongoose');
var geo	= require("../geo");
var app = require("../app");
var models = require('../models');

/*
 * Locations Routes
 * 
*/

exports.list = function(req,res){
    models.Location.find({}, function(err,locs){
	res.header('Cache-Control', 'no-cache');
	res.send(locs.map(function(l) {
	    var latLon = geo.gridToLatLon(l.gridRef);
	    return {ref: l.ref, gridRef: l.gridRef, lat: latLon.lat, lon: latLon.lon, location: l.location};
	}));
    });
};

exports.queryGridReference = function(req,res){
    var gridRef = req.params[0] + req.params[1];

    models.Location.search(gridRef, req.query.radius, function(err, locs){
  	if ( err != false ) {
  	    res.send({"error": true});
  	} else{
    	    res.json(locs);
  	}
  });
};

//////////////////////////////////////////////////

exports.create = function(req,res){
    var gridRef = req.body.gridRef;
    var location = req.body.location;
    var radius = req.body.radius || 0.1;
	
    var gridRefRegEx = /(([a-zA-Z]{2})(([0-9]{2})|([0-9]{4})|([0-9]{6})|([0-9]{8})|([0-9]{10})))/;
    var gridRefTest = gridRefRegEx.test(gridRef);

    if ( gridRefTest == false ) {
	res.send({"error": true});
	return;
    }

    models.Location.search( gridRef, radius, function(err,locs) {
	if ( err != false ) {
	    res.send( {"error": true} );
	    return;
	}

	if ( locs.length != 0 ) {
	    res.send({ "error": false, "result": false, "locs": locs });
	} else{
	    var loc = new models.Location({"gridRef": gridRef, "location": location});
	    loc.save( function(err){
		res.send({ "error": false, "result": true, "ref": loc.ref });
	    });
	}
    });	
};

//////////////////////////////////////////////////

exports.readLocation = function(req,res){
    models.Location.findOne({ref:parseInt(req.params.id)}, function(err,l){
	if ( l != null ) {
	    var latLon = geo.gridToLatLon(l.gridRef);
	    res.send({error: false, ref: l.ref, gridRef: l.gridRef, lat: latLon.lat, lon: latLon.lon, location: l.location});
	} else {
	    res.send({error: true, ref: parseInt(req.params.id), gridRef: ""});
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

