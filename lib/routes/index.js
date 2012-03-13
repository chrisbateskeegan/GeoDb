var locs = require('./locations');

module.exports.init = function(app) {
	//app.get('/', routes.index);
	app.get('/locations.:format', locs.list );
	app.post('/location.:format?', locs.create );
	app.get('/location/:id.:format?', locs.readLocation );
	app.put('/locations/:id.:format?', locs.updateLocation );
	app.del('/locations/:id.:format?', locs.deleteLocation );
	app.get('/locations/query/:gridRef(([a-zA-Z]{2})(([0-9]{2})|([0-9]{4})|([0-9]{6})|([0-9]{8})|([0-9]{10})))', locs.queryGridReference);
};