
/**
 * Module dependencies.
 */

var express 		= require('express')
  , routes 			= require('./routes')
  , mongoose 		= require('mongoose')
  , models 			= require('./models');

module.exports = function(options) {
	var app = express.createServer();
	
	app.configure(function(){
	  app.use(express.bodyParser());
	  app.use(express.methodOverride());
	  app.use(express.logger());
	  app.use(app.router);
	});

	app.configure('development', function(){
	  app.set('db-uri', 'mongodb://localhost/geodb-dev'); 
	  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	app.configure('production', function(){
	  app.set('db-uri', 'mongodb://localhost/geodb-production'); 
	  app.use(express.errorHandler());
	});

	app.configure('test', function(){
	  app.set('db-uri', 'mongodb://localhost/geodb-test');
	  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	app.db = mongoose.connect(app.set('db-uri'));
	models.init(app);
	routes.init(app);
	
  app.listen(3000);
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);  
  
  return app;
};