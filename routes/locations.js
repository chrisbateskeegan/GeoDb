var mongoose 	= require('mongoose');
var geo	= require("../geo");
var app = require("../app");
var models = require('../models');
var _ = require('underscore');

/*
 * Locations Routes
 * 
 */

exports.listJson = function(req,res,next){
  if ( req.params['format'] != "json" ) {
    next();
    return;
  }

  var q = models.Location.find({}).sort({ref:1});
  if ( req.query.skip ) {
    q.skip(req.query.skip);
  }

  if ( req.query.limit ) {
    q.limit(req.query.limit);
  }

  q.exec(function(err,locs){
    if ( err ) {
      res.json([]);
      return;
    }
    res.header('Cache-Control', 'no-cache');
    res.send(locs.map(function(l) {
      var latLon = geo.gridToLatLon(l.gridRef);
      return {
	ref: l.ref, 
	gridRef: l.gridRef, 
	lat: latLon.lat, 
	lon: latLon.lon, 
	location: l.location
      };
    }));
  });
};

exports.list = function(req,res,next){
  res.render('list', { title: "GeoDb List Locations", controller: "LocationListController" });
}

exports.queryGridReference = function(req,res){
  var gridRef = req.params[0] + req.params[1];

  models.Location.search(gridRef, req.query.radius, function(err, locs){
    if ( err != false ) {
      res.send({"error": true});
    } else{
      res.jsonp(locs);
    }
  });
};

exports.queryLatLong = function(req,res){
  if (req.query.latitude==undefined || req.query.longitude==undefined) {
    return res.send(400);
  }

  var latitude = Number(req.query.latitude);
  var longitude = Number(req.query.longitude);
  var gridRef = geo.latLonToGrid({lat:latitude,lon:longitude});
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
	if ( err ) {
	  res.send({ "error": true, "result": false });
	} else {
	  res.send({ "error": false, "result": true, "ref": loc.ref });
	}
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
  var gridRef = req.body.gridRef;
  var location = req.body.location;
  var gridRefRegEx = /(([a-zA-Z]{2})(([0-9]{2})|([0-9]{4})|([0-9]{6})|([0-9]{8})|([0-9]{10})))/;
  var gridRefTest = gridRefRegEx.test(gridRef);

  if ( gridRefTest == false && location == undefined ) {
    res.json({"error": true});
    return;
  }

  models.Location.findOne({ref:parseInt(req.params.id)}, function(err,l){
    if ( l == null ) {
      res.json({error:true});  
      return;
    }

    if ( _.isString(location) == true && (_.isEmpty(gridRef) || gridRef == l.gridRef) ) {
      l.location = location;
      l.save(function(err){
	if ( err ) {
	  res.json({error:true});  
	} else {
	  res.json({error:false});
	}
      });
      return;
    }

    if ( _.isEqual(gridRef,l.gridRef) == false && gridRefTest == true ) {
      var latLon = geo.gridToLatLon(gridRef);  
      l.gridRef = gridRef;
      l.lat = latLon.lat;
      l.lon = latLon.lon;

      models.Location.search(gridRef, 0.1, function(err,locs) {
	if ( err ){
	  res.json({error:true});
	  return;
	}

	if ( locs.length > 1 ) {
	  res.json({error:true, reason:'locations overlap'});
	  return;
	}

	if ( locs.length == 1 && _.isEqual(locs[0].ref,l.ref)==false ) {
	  res.json({error:true,reason:'locations overlap'});
	  return;
	}

	if ( _.isString(location) == true ){
	  l.location = location;
	}

	l.save(function(err){
	  if ( err ) {
	    res.json({error:true});  
	  } else {
	    res.json({error:false});
	  }
	});
      });
    }
  });
};

//////////////////////////////////////////////////

exports.deleteLocation = function(req,res){
};

//////////////////////////////////////////////////
