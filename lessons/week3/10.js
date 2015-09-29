// Maybe, now with bind.

Maybe = function(value) {
  var Nothing = {
    bind: function(fn) { return this; }
  };

  var Just = function(value) { 
    return {
      bind: function(fn) { return Maybe(fn.call(this, value)); }
    };
  };

  if (typeof value === 'undefined' || value === null)
    return Nothing;

  return Just(value);
};
