require('./polyfills');
var Response = require('./Response');

module.exports = function getRemote(endpoint, options) {
  return new Response(endpoint, options);
};
