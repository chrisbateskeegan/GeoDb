var   app					= 	require('../../app')
		,	mongoose    =   require('mongoose')
    , Schema      =   mongoose.Schema
    , geo					=		require('../geo');

module.exports = function(db) {
	var Location = module.exports = new Schema({
	  'ref'					: {'type': Number, 'index': true },
	  'gridRef'			: {'type': String, 'index': true},
		'location'		: {'type': String, 'default': '' },
		'lat'					: Number,
		'long'				: Number
	}, {"strict": true});
	
	Location.pre('save', function(next) {
		var Self = mongoose.model('Location');
		var self = this;
		if ( this.isNew ) {
			if ( Self.nextLocationRef == -1 ) {
				Self.find({}, function(err,locs){
					if ( err ) next(err);
					var biggest = 0;
					locs.forEach(function(loc,idx){
						biggest = Math.max(biggest,loc.ref);
					});
					Self.nextLocationRef = biggest+1;
					self.ref = Self.nextLocationRef++;
					next();
				});
			} else {
				self.ref = Self.nextLocationRef++;
				next();
			}
			
		} else {
			next();
		}
	});
	
	Location.statics.nextLocationRef = -1;

	Location.statics.search = function(gridRef, radius, fn) {
		radius = (( radius != undefined ) ? radius : 1.0)*1000;
		var searchRef = geo.getNumericGrid(gridRef);
		
		this.find({}, function(err,locs){
			if ( err != null ) {
				fn(true, []);
				return;
			}
			
			fn(false, locs.filter(function(l){
				var locRef = geo.getNumericGrid(l.gridRef);
				var dist = geo.getDistanceNumeric( searchRef, locRef );
				
				if ( dist < radius ) {
			    var latLon = geo.gridToLatLon(l.gridRef);
			    l.lat = latLon.lat;
			    l.lon = latLon.lon;
			    l.distance = dist/1000;
				}
				
				return dist <= radius;
		  }).map(function(l){
		  	return { "ref": l.ref, "gridRef": l.gridRef, "lat": l.lat, "long": l.lon, "location": l.location, "distance": l.distance };
		  }));
		});
	};
	
	return mongoose.model( 'Location', Location );
};

