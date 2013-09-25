var express 	= require('express');
var routes 	= require('./routes');
var mongoose 	= require('mongoose');
var models 	= require('./models');
var path        = require('path');
var _           = require('underscore');

var app = module.exports = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/', compress: true }));
  app.use('/client',express.static(path.join(__dirname, 'client')));
  app.use(express.logger());
});

app.configure('development', function(){
  app.set('db-uri', 'mongodb://localhost/geodb-dev');
  app.set('port', '3001');
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.set('db-uri', 'mongodb://localhost/geodb-production');
  app.set('port', '5000');
  app.use(express.errorHandler());
});

app.configure('test', function(){
  app.set('db-uri', 'mongodb://localhost/geodb-test');
  app.set('port', '3002');
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var initialise = _.once(function(){
  app.db = mongoose.connect(app.set('db-uri'));

  routes.init(app);

  app.server = app.listen(app.set('port'));
  console.log("Express server listening on port %d in %s mode", app.set('port'), app.settings.env);
});

initialise();