// Monad laws

// Law 1: Left identity
Maybe(x).bind(fn) == Maybe(fn(x)); // for all x, fn

// Law 2: Right identity
Maybe(x).bind(function(x){return x;}) == Maybe(x); // for all x

// Law 3: Associativity
Maybe(x).bind(fn).bind(gn) == Maybe(x).bind(function(x) {
  return gn(fn(x));
}); // for all x, fn, gn
