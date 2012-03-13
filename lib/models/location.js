var   app					= 	require('../../app')
		,	mongoose    =   require('mongoose')
    , Schema      =   mongoose.Schema
    , geo					=		require('../geo');

module.exports = function(db) {
	var Location = module.exports = new Schema({
	  'ref'         : {'type': Number, 'index': true },
	  'gridRef'     : {'type': String, 'index': true},
		'location'    : {'type': String, 'default': '' },
		'lat'         : Number,
		'long'        : Number
	}, {"strict": true});
	
	Location.pre('save', function(next) {
		var self = mongoose.model('Location');
		if ( this.isNew ) {
			this.ref = self.nextLocationRef++;
		}
		
		next();
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
			    var latLong = geo.gridToLatLong(l.gridRef);
			    l.lat = latLong.lat;
			    l.long = latLong.long;
			    l.distance = dist/1000;
				}
				
				return dist <= radius;
		  }).map(function(l){
		  	return { "ref": l.ref, "gridRef": l.gridRef, "lat": l.lat, "long": l.long, "location": l.location, "distance": l.distance };
		  }));
		});
	};
	
	return mongoose.model( 'Location', Location );
}

