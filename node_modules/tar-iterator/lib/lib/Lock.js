var LC = require('lifecycle');
var BaseIterator = require('extract-base-iterator');

module.exports = LC.RefCountable.extend({
  constructor: function () {
    LC.RefCountable.prototype.constructor.apply(this, arguments);
  },
  __destroy: function () {
    if (this.iterator) {
      BaseIterator.prototype.end.call(this.iterator, this.err || null);
      this.iterator = null;
    }
  },
});
