var pkgin = require('../');

pkgin.search(process.argv[2] || 'nginx', function(err, result) {
  if (err) throw err;
  console.log(result);
});
