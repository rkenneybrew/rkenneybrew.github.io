module.exports = function normalizeVersion(raw, schedules) {
  var parts = raw.version.substr(1).split('.');

  var version = {
    version: raw.version,
    name: parts[0] !== 0 ? 'v' + +parts[0] : 'v' + +parts[0] + '.' + +parts[1],
    semver: parts[0] + '.' + +parts[1] + '.' + +parts[2],
    major: +parts[0],
    minor: +parts[1],
    patch: +parts[2],
    lts: raw.lts,
    date: new Date(raw.date),
    raw: raw,
  };

  var schedule = null;
  for (var index = 0; index < schedules.length; index++) {
    var test = schedules[index];
    if (test.name === version.name) {
      schedule = test;
      break;
    }
  }
  if (schedule && raw.lts) version.codename = schedule.codename;
  return version;
};
