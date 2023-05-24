module.exports = function validateAttributes(attributes, keys) {
  var key;
  for (var index = 0; index < keys.length; index++) {
    key = keys[index];
    if (attributes[key] === undefined) throw new Error('Missing attribute ' + key + '.Attributes ' + JSON.stringify(attributes));
  }
};
