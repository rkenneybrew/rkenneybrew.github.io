( function( G, U ) {
  "use strict";
  var id_num = 0;
  G.explosion.lib.unique= function( ext_id ) {
    ext_id = ext_id || "";
    id_num++;
    var date = new Date();
    var id = date.getTime();
    var plus = '' + id_num;
    var len = plus.length;
    for ( var i = len; i < 3; i++ ) {
      plus = '0' + plus;
    }
    return ext_id + id + plus;
  }
}( this, undefined ) );
