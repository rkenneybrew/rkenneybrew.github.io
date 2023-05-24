'use strict';

var Messanger = require( './messanger' );
var Router = require('./router.js');


exports = module.exports = createApplication;

function createApplication(options) {
  var server;
  if( !('port' in options) && !('server' in options) ){
    server = new Messanger( {server: options} );
  }else{
    server = new Messanger(options);
  }
  return server;
};


//exports.Route = Route;
exports.Router = Router;
