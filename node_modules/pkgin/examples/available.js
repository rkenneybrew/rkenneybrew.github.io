var pkgin = require('../');

pkgin.available(function(err, result) {
  if (err) throw err;
  console.log(result);
});
