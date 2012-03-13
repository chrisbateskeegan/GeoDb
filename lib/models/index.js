var locInit 			= require('./location');

module.exports.init = function(app) {
	var Location = locInit();
	app.models = { "Location" : Location };
	return app.models;
};