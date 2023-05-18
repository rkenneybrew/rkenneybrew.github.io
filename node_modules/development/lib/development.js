'use strict';

/*development - under development */

var npm = require('npm')
  , fs = require('fs')
  , path = require('path');

var gitfetch = require('./git-fetch'),
    gitcheckout = require('./git-checkout'),
    gitpull = require('./git-pull'),
    npminstall = require('./npm-install'),
    bowerinstall = require('./bower-install');


var Development = module.exports = function(config) {
  this.config = util.extend({}, Development.defaults, config);
}

Development.defaults = {
  packageFile: path.join(__dirname,'../','./package.json'),
}


Development.prototype = {};

Development.fetch = function(path, callback) {
  var params = {
    path: path || '.',
  };
  gitfetch(params, function(err, output) {
    if (err) { 
      return callback(true, err);
    } else {
      return callback(false, output);
    }
  });
};

Development.checkout = function(params, callback) {
  var params = {
    tags: params.tag,
    branch: params.branch,
    path: params.path,
  };
  
  gitcheckout(params, function(err, output) {
    if (err) { 
      return callback(true, err);
    } else {
      return callback(false, output);
    }
  });
};

Development.pull = function(path, callback) {

  var params = {
    path: path || '.',
  };

  gitpull(params, function (err, consoleOutput) {
    if (err) {
      return callback(true, consoleOutput);
    } else {
     return callback(false, consoleOutput);
    }
  });
};


Development.npmInstall = function(path, callback) {
  var params = {
    path: path || '.',
  };

  npminstall(params, function(err, consoleOutput) {
    if (err) {
      return callback(true, consoleOutput);
    } else {
     return callback(false, consoleOutput);
    }
  });
}

Development.bowerInstall = function(path, callback) {
  var params = {
    path: path || '.',
  };

  bowerinstall(params, function(err, consoleOutput) {
    if (err) {
      return callback(true, consoleOutput);
    } else {
     return callback(false, consoleOutput);
    }
  });
}