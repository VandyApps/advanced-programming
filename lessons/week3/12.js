// Fully-featured maybe.

Maybe = function(value) {
  var Nothing = {
    bind: function(fn) { 
      return this; 
    },
    // Returns true if the Maybe is Nothing and false otherwise.
    // isNothing :: Maybe a -> Bool
    isNothing: function() { 
      return true; 
    },
    // Returns the value inside of the Maybe monad.
    // val :: Maybe a -> a
    val: function() { 
      throw new Error("cannot call val() nothing"); 
    },
    // From the Haskell wiki: "The maybe function takes a default value,
    // a function, and a Maybe value. If the Maybe value is Nothing, 
    // the function returns the default value. Otherwise, it applies 
    // the function to the value inside the Just and returns the result."
    // maybe :: b -> (a -> b) -> Maybe a -> b
    maybe: function(def, fn) {
      return def;
    }
  };

  var Just = function(value) { 
    return {
      bind: function(fn) { 
        return Maybe(fn.call(this, value));
      },
      isNothing: function() { 
        return false; 
      },
      val: function() { 
        return value;
      },
      maybe: function(def, fn) {
        return fn.call(this, value);
      }
    };
  };

  if (typeof value === 'undefined' || value === null)
    return Nothing;

  return Just(value);
};
