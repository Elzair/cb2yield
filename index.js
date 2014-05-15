// Convert a function from a callback-style function to a yieldable
module.exports = function(fn, args) {
  // Return function suitable for use in generators
  return function(ffn) {
    // Handle case where fn is not a valid function
    if (!(fn instanceof Function)) {
      throw "cb2yield requires a function as the first argument!";
    }

    args = args || [];
    // Handle case where args is not an array
    if (!Array.isArray(args)) {
      throw "cb2yield requires an array as the second argument!";
    }

    // Define result function
    var result_fn = function(result) {
      ffn(null, result);
    };

    var new_args = [];
    var cb_pushed = false;
    for (var i=0; i<args.length; i++) {
      // Push result_fn to index specified by placeholder object: {'cb2yield_cb_placeholder': null}
      if (args[i] !== null && typeof args[i] === 'object' && args[i].hasOwnProperty('cb2yield_cb_placeholder')) {
        new_args.push(result_fn);
        cb_pushed = true;
      }
      else {
        new_args.push(args[i]);
      }
    }

    // If args does not contain a placeholder object, push result_fn to end of new_args
    if (!cb_pushed) {
      new_args.push(result_fn);
    }

    // Call fn with specified arguments
    fn.apply(null, new_args);
  };
}
