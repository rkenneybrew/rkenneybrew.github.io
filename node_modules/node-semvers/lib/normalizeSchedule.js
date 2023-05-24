module.exports = function normalizeSchedule(name, raw) {
  var schedule = {
    name: name,
    semver: name.slice(1),
    raw: raw,
  };

  schedule.start = new Date(raw.start);
  schedule.end = new Date(raw.end);
  if (raw.codename) schedule.codename = raw.codename.toLowerCase();
  if (raw.lts) schedule.lts = new Date(raw.lts);
  if (raw.maintenance) schedule.maintenance = new Date(raw.maintenance);

  return schedule;
};
