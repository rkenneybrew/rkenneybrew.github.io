( function( G, U ) {
  "use strict";
  G.explosion.lib.get_host = function() {
    let host = {};
    if ( location.origin.match( /^file/ ) ) {
      host.http = "http://127.0.0.1:3000/";
      host.ws = "ws://127.0.0.1:3000/";
    } else {
      host.http = location.origin + "/";
      host.ws = location.origin;
      host.ws = host.ws.replace( /^http/, 'ws' );
      host.ws = host.ws.replace( /^https/, 'wss' );
      host.ws += "/";
    }
    return host;
  };
}( this, undefined ) );

