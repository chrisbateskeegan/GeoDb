var express 	= require('express');
var routes 	= require('./routes');
var mongoose 	= require('mongoose');
var models 	= require('./models');

var app = exports.app = module.exports = express();

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.logger());
    app.use(app.router);
    app.set("jsonp callback", true);
});

app.configure('development', function(){
    app.set('db-uri', 'mongodb://localhost/geodb-dev');
    app.set('port', '3001');
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.set('db-uri', 'mongodb://localhost/geodb-production');
    app.set('port', '3000');
    app.use(express.errorHandler());
});

app.configure('test', function(){
    app.set('db-uri', 'mongodb://localhost/geodb-test');
    app.set('port', '3002');
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.db = mongoose.connect(app.set('db-uri'));

routes.init();

app.server = app.listen(app.set('port'));
console.log("Express server listening on port %d in %s mode", app.set('port'), app.settings.env);
