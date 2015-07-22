/**
 * Week 3 - Introduction to Monads
 *
 * - Maybe monad
 *
 * - Monad laws: Left Identity, Right Identity, Associativity
 *
 * - Resources: 
 *      https://curiosity-driven.org/monads-in-javascript
 *      http://sean.voisen.org/blog/2013/10/intro-monads-maybe/
 */

/* MAYBE MONAD */

// Our company has decided to consume Elgoog's Maps API. We will be providing
// the API with a city and finding the coordinates of it's capitol. Elgoog
// returns a JSON object as their response. Here is a successful response to
// a query:

var response = {
    'location': {
        'country': 'USA',
        'city': {
            'name': 'Boston'
            'coordinates': {
                'latitude': 1234,
                'longitude': 2345
            }
        }
    }
}

// Sometimes, Elgoog doesn't give us all the information we need. For instance,
// they may not have the coordinates for our city, or the city we searched for
// might not exist at all. Here are two examples of responses that indicate
// failure.

var badResponse = {
    'location': null
}

var badResponse = {
    'location': {
        'country': 'USA',
        'city': {
            'name': 'Boston',
            'coordinates': null
        }
    }
}

// Okay, now that we know what responses can look like, let's write
// some code to retrieve these coordinates from the API. We want to return
// an array containing the latitude and longitude pair.

function getCoordinates(response) {
    var latitude = response.location.city.coordinates.latitude;
    var longitude = response.location.city.coordinates.longitude;
    return [latitude, longitude];
}

// What happens when we call this code with the successful response?

var coords = getCoordinates(response); // => [1234, 2345]

// We're done! Oh wait, we still haven't tested the failed lookup response.
// Let's try that.

var coords = getCoordinates(badResponse); // => ERROR

// Looks like that won't work. In some languages, this will cause a null pointer
// exception (do you see why?).

// Okay, so it looks like we'll need to do some checks in our code to make sure
// that values aren't null.

function getCoordinates(response) {
    var latitude,
        longitude;

    if (response !== null && response.location !== null && response.location.city !== null && response.location.city.coordinates != null) {
        latitude = response.location.city.coordinates.latitude;
        longitude = response.location.city.coordinates.longitude;

        if (latitude === null || longitude === null) {
            return "Error: Coordinates cannot be null";
        }
    } else {
        return "Error: Response object did not contain coordinates.";
    }

    return [latitude, longitude];
}

// Phew, that was a lot of null checks. Unfortunately, they are necessary if we
// are to be 100% sure that an exception won't be thrown.
//
// Except... <hint> maybe </hint> we can be smarter about how we perform those
// checks.

/* INTRODUCING THE MAYBE MONAD */

// The Haskell definition of the Maybe monad is the following:
//
// data Maybe t = Just t | Nothing
//
// That line says that `Maybe` consists of 'Just' something (t), or 'Nothing'
// at all.

// Let's write our `Maybe` function in JavaScript and see how it can help us. 
// Then we'll return to it and see exactly how it helps us.

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

// Let's try passing a few different things to Maybe.

Maybe(null) == Nothing; // => true
typeof Maybe(null); // => 'object'

Maybe('foo') == Nothing; // => false
Maybe('foo')(); // => 'foo'
typeof Maybe('foo'); // => 'function'

// Now we can rewrite our function using Maybe.

function getCoordinates(response) {
    if (Maybe(response) !== Nothing && Maybe(response.location) !== Nothing && 
        Maybe(response.location.city) !== Nothing && Maybe(response.location.city.coordinates) != Nothing) {
        var latitude = Maybe(response.location.city.coordinates.latitude);
        var longitude = Maybe(response.location.city.coordinates.longitude);

        if (latitude === Nothing || longitude === Nothing) {
            return "Error: Coordinates cannot be null";
        }
        return [latitude, longitude];
    } else {
        return "Error: Response object did not contain coordinates.";
    }
}

// Well, that actually didn't help us very much. In fact, we had to _increase_
// the amount of code we wrote to use the Maybe monad. That sucks.
//
// Turns out, our current Maybe function isn't actually a monad. Why? Because
// it can't conform to the monad laws.

/* MONAD LAWS */

// There are three 'laws' that must be followed in order to create a monad.
// These laws are like the mathematical version of an interface. If our monads
// conform to these laws, then functions that act on interfaces can be used on
// our monads, and our monads can be used (stacked) with other monads.
//
// Here are the laws in JavaScript. We will use Maybe as the monad placeholder 
// in these laws:
//
// Law 1: Left identity
//
// Maybe(x).bind(fn) == Maybe(fn(x)); // for all x, fn
//
// Law 2: Right identity
//
// Maybe(x).bind(function(x){return x;}) == Maybe(x); // for all x
//
// Law 3: Associativity
//
// Maybe(x).bind(fn).bind(gn) == Maybe(x).bind(function(x) {
//   return gn(fn(x));
// }); // for all x, fn, gn


/* BIND */

// By now maybe (no pun intended) you've noticed that those laws use a 'bind'
// function that we haven't written yet. As it turns out, the bind function is
// the last piece in the monadic puzzle. Let's write one.
//
// First, let's think about what exactly our bind function needs to do.
// Essentially, if we have a Maybe monad, we need our bind function to perform
// an action on the value contained in our Maybe, then wrap the return value
// back up in another Maybe.
//
// In Haskell types: Maybe a -> (a -> Maybe b) -> Maybe b
//                   ^param 1   ^param 2          ^return value
//
// So the bind function takes a Maybe (param 1) and a function that transforms
// a value (param 2) and returns a Maybe that contains the transformed value.
// See: Box analogy.
//
// Note: Because of JavaScript's weak type system, the type signature of our
// Maybe monad is actually 'Maybe a -> (a -> b) -> Maybe b'.

// Okay, we know enough about the bind type to add it to our Maybe monad.

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

// Now we can rewrite our Elgoog client so that it uses the bind function.

function getCoordinates(response) {
    var coordinates = Maybe(response).bind(function(r) {
        return r.location;
    }).bind(function(r) {
        return r.city;
    }).bind(function(r) {
        return r.coordinates;
    });

    var latitude = coordinates.bind(function(r) {return r.latitude});
    var longitude = coordinates.bind(function(r) {return r.longitude});

    if (latitude === Nothing || longitude === Nothing) {
        return "Error: Coordinates cannot be null";
    }
    return [latitude, longitude];
}

// This code looks a lot cleaner. Our intent is more clear, and the code is
// relatively "flat". But by adding a few more functions to our monad, we can
// improve this code even more.

Maybe = function(value) {
  var Nothing = {
    bind: function(fn) { 
      return this; 
    },
    isNothing: function() { 
      return true; 
    },
    val: function() { 
      throw new Error("cannot call val() nothing"); 
    },
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

// Phew, that's a lot. Let's take a look at the new functions:
//
// isNothing: Maybe a -> Bool
//  - This function returns true if the Maybe is Nothing and false otherwise.
//
// val: Maybe a -> a
//  - This function returns the value inside of the Maybe monad.
//
// maybe: Maybe: b -> (a -> b) -> Maybe a -> b
//  - From the Haskell wiki: "The maybe function takes a default value,
//  a function, and a Maybe value. If the Maybe value is Nothing, the function
//  returns the default value. Otherwise, it applies the function to the value
//  inside the Just and returns the result."

// Let's rewrite our Elgoog client one final time using our helpful new
// functions.

function getCoordinates(response) {
    var coordinates = Maybe(response).bind(function(r) {
        return r.location;
    }).bind(function(r) {
        return r.city;
    }).bind(function(r) {
        return r.coordinates;
    }).maybe("Error: Coordinates cannot be null", function(r) {
        return [r.latitude, r.longitude];
    });
}

// That's it, our monad takes care of the rest

