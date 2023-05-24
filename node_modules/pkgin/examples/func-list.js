var pkgin = require('../');

pkgin('list', function(err, result) {
  if (err) throw err;
  console.log(result);
});
