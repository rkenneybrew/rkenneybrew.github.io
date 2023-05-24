module.exports.major = function major(version) {
  return version.major === 0 ? version.major + '.' + version.minor : version.major;
};

module.exports.minor = function minor(version) {
  return version.major === 0 ? version.major + '.' + version.minor + '.' + version.patch : version.major + '.' + version.minor;
};
