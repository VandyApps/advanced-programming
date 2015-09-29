// Barebones Maybe in JavaScript.

Maybe = function(value) {
  var Nothing = {};

  var Just = function(value) { 
    return function() {
      return value; 
    };
  };

  if (typeof value === 'undefined' || value === null)
    return Nothing;

  return Just(value);
};

Maybe(null) == Nothing; // => true
typeof Maybe(null); // => 'object'

Maybe('foo') == Nothing; // => false
Maybe('foo')(); // => 'foo'
typeof Maybe('foo'); // => 'function'
