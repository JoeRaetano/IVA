/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/datatypes', require('./api/datatype'));
  app.use('/api/modes', require('./api/mode'));
  app.use('/api/devices', require('./api/device'));
  app.use('/api/sensors', require('./api/sensor'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/vehicle', require('./api/vehicle'));
  app.use('/api/pid', require('./api/pid'));
  app.use('/api/function', require('./api/function'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
