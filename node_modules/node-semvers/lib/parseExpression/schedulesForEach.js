module.exports = function schedulesForEach(schedules, filter, fn) {
  for (var index = 0; index < schedules.length; index++) {
    var schedule = schedules[index];
    !filter(schedule) || fn(schedule);
  }
};
