var locs = require('./locations');
var geo = require('../geo')

exports.init = function(app) {
  //app.get('/', routes.index);

  app.get('/', function(req,res){
    res.render('index',{title: "GeoDB", controller: 'LocationListController'});
  });

  app.get('/locations.:format?', [locs.listJson,locs.list] );
  app.post('/location.:format?', locs.create );
  app.get('/location/:id.:format?', locs.readLocation );
  app.put('/locations/:id', locs.updateLocation );
  app.del('/locations/:id.:format?', locs.deleteLocation );
  app.get('/locations/query/:gridRef(([a-zA-Z]{2})(([0-9]{2})|([0-9]{4})|([0-9]{6})|([0-9]{8})|([0-9]{10})))', locs.queryGridReference);
  app.get('/locations/queryLatLong', locs.queryLatLong);
  app.get('/latLongToGridRef', latLongToGridRef);

  app.get('/partials/:partial', function(req,res){
    res.render('partials/'+req.params.partial, {});
  });
};

latLongToGridRef = function(req,res){
  if (req.query.latitude==undefined || req.query.longitude==undefined) {
    return res.send(400);
  }

  var latitude = Number(req.query.latitude);
  var longitude = Number(req.query.longitude);
  var gridRef = geo.latLonToGrid({lat:latitude,lon:longitude});

  res.json({gridRef:gridRef});
};