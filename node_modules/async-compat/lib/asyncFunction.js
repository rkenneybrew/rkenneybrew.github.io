var asyncValue = require('./asyncValue');

module.exports = function asyncFunction(fn, useCallback, arg1, arg2, arg3, arg4, arg5, arg6, callback) {
  function wrapper(err, result) {
    err ? callback(err) : asyncValue(result, callback);
  }

  if (useCallback) {
    switch (arguments.length) {
      case 3:
        callback = arg1;
        return fn(wrapper);
      case 4:
        callback = arg2;
        return fn(arg1, wrapper);
      case 5:
        callback = arg3;
        return fn(arg1, arg2, wrapper);
      case 6:
        callback = arg4;
        return fn(arg1, arg2, arg3, wrapper);
      case 7:
        callback = arg5;
        return fn(arg1, arg2, arg3, arg4, wrapper);
      case 8:
        callback = arg6;
        return fn(arg1, arg2, arg3, arg4, arg5, wrapper);
      case 9:
        return fn(arg1, arg2, arg3, arg4, arg5, arg6, wrapper);
      default:
        var args = Array.prototype.slice.call(arguments, 2);
        callback = args.pop();
        args.push(wrapper);
        return fn.apply(null, args);
    }
  } else {
    switch (arguments.length) {
      case 3:
        callback = arg1;
        return wrapper(null, fn());
      case 4:
        callback = arg2;
        return wrapper(null, fn(arg1));
      case 5:
        callback = arg3;
        return wrapper(null, fn(arg1, arg2));
      case 6:
        callback = arg4;
        return wrapper(null, fn(arg1, arg2, arg3));
      case 7:
        callback = arg5;
        return wrapper(null, fn(arg1, arg2, arg3, arg4));
      case 8:
        callback = arg6;
        return wrapper(null, fn(arg1, arg2, arg3, arg4, arg5));
      case 9:
        return wrapper(null, fn(arg1, arg2, arg3, arg4, arg5, arg6));
      default:
        var args1 = Array.prototype.slice.call(arguments, 2);
        callback = args1.pop();
        return wrapper(null, fn.apply(null, args1));
    }
  }
};
