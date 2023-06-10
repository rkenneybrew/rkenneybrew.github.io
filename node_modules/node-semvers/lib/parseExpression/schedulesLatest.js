var schedulesForEach = require('./schedulesForEach');

module.exports = function schedulesLatest(schedules, filter) {
  var latest = null;
  schedulesForEach(schedules, filter, function (schedule) {
    if (!latest || latest.start < schedule.start) latest = schedule;
  });
  return latest;
};
