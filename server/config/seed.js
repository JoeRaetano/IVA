/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Sensor = require('../api/sensor/sensor.model');
var CollectionMode = require('../api/mode/mode.model');
var Datatype = require('../api/datatype/datatype.model');
var Vehicles = require('../api/vehicle/vehicle.model');
var Pids = require('../api/pid/pid.model');
var Functions = require('../api/function/function.model');


Functions.find({}).remove(function() {});

Pids.find({}).remove(function() {});

Vehicles.find({}).remove(function() {
  Vehicles.create(
  {
    make: "Ford",
    model: "Cmax",
    year: 2013,
    desc: "This is a ford car."
  },
  {
    make: "Toyota",
    model: "Camry",
    year: 1006,
    desc: "This is a toyota car."
  });
});

CollectionMode.find({}).remove(function() {
  CollectionMode.create({
    name: 'Platform Testing',
    desc: 'Slow-collect mode for testing platform and sensors',
    active: true
  }, {
    name: 'Normal Collect',
    desc: 'Normal rate collect. This is the standard collection mode',
    active: true
  }, {
    name: 'Intense Collect',
    desc: 'High-rate collection from sensor platform. Used sparingly',
    active: true
  });
});


Datatype.find({}).remove(function() {
  Datatype.create({
    name: 'Numeric',
    desc: 'Stores ints, floats, similar',
    active: true
  }, {
    name: 'Text',
    desc: 'Used for free-form strings',
    active: true
  }, {
    name: 'Coordinates',
    desc: 'Used for lat/lon pairs',
    active: true
  }, {
    name: 'Binary',
    desc: 'Used for binary blobs (files, images, videos, etc.)',
    active: true
  });
});


Sensor.find({}).remove(function() {
  Sensor.create({
      name:'GPS',
      desc:'Standard USB GPS Receiver',
      active: true
    }, {
      name:'Thermometer',
      desc:'High-temp thermometer (90F - 180F)',
      active: true
    }, {
      name:'Pressure Sensor',
      desc:'Binary flag - indicates if anything is on the sensor or not',
      active: true
    }, {
      name:'Ambient Light',
      desc:'Measures the level of the ambient light',
      active: true
    }, {
      name:'Proximity',
      desc:'Indicates if anything is within a certain distance of the sensor',
      active: true
    }, {
      name:'Camera',
      desc:'Standard USB web cam',
      active: false
    }, {
      name:'Moisture',
      desc:'Binary flag - indicates if the sensor is exposed to water',
      active: true
    }, {
      name:'Audio',
      desc:'Standard Audio Sensor',
      active: false
    });
});


Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Rob Gillen',
    email: 'rob@gillenfamily.net',
    password: 'eQuest123!'
  }, {
      provider: 'local',
      role: 'admin',
      name: 'Joseph Raetano',
      email: 'joseph.raetano@gmail.com',
      password: 'devpass1'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Joshua Fagan',
      email: 'jfagan2@vols.utk.edu',
      password: 'wordpass'
    },{
    provider: 'local',
    role: 'admin',
    name: 'Jordan Holland',
    email: 'jholla19@vols.utk.edu',
    password: 'password'
  },
    function() {
      console.log('finished populating users');
    }
  );
});
