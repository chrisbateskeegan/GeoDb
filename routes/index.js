var locs = require('./locations');
var app = require('../app');

exports.init = function() {
    //app.get('/', routes.index);
    app.app.get('/locations.:format', locs.list );
    app.app.post('/location.:format?', locs.create );
    app.app.get('/location/:id.:format?', locs.readLocation );
    app.app.put('/locations/:id.:format?', locs.updateLocation );
    app.app.del('/locations/:id.:format?', locs.deleteLocation );
    app.app.get('/locations/query/:gridRef(([a-zA-Z]{2})(([0-9]{2})|([0-9]{4})|([0-9]{6})|([0-9]{8})|([0-9]{10})))', locs.queryGridReference);
};