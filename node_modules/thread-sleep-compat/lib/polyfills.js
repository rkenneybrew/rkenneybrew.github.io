var allTargets = require('node-abi').allTargets;
var semver = require('semver');

function patchVersions() {
  var abi = null;
  var runtime = 'node';
  var target = process.versions.node;
  for (var i = 0; i < allTargets.length; i++) {
    var t = allTargets[i];
    if (t.runtime !== runtime) continue;
    if (semver.lte(t.target, target)) abi = t.abi;
    else break;
  }
  return abi;
}
if (!process.versions.modules) process.versions.modules = patchVersions();
