Either = function() {
    
    // Left holds our "error value." When something goes wrong, we can wrap up
    // a message or other failure result into Left and no future binds on this
    // monad instance will have any effect on Left. Left is like a safe version
    // of an exception.
    var Left = function(value) {
        return {
            // When binding on left, we don't want to change the Left value.
            // Return this left value again.
            bind: function(fn) { 
                // TODO
            },

            // Throw an exception.
            right: function() {
                // TODO
            },

            // Return the unwrapped value.
            left: function() {
                // TODO
            }
        };
    };

    // Right holds our "right" value. This value can be mutated by bind and
    // will be returned as long as we don't have any errors.
    var Right = function(value) { 
        return {
            // Return the result of applying a monadic operation fn on value.
            bind: function(fn) { 
                // TODO
            },

            // Return the unwrapped value.
            right: function() {
                // TODO
            },

            // Throw an exception.
            left: function() {
                // TODO
            }
        };
    };

    // Ignore.
    return {
        Left: function(value) {
            return Left(value);
        },
        Right: function(value) {
            return Right(value);
        },
        of: function(value) {
            return Right(value);
        },
    }
};

// Helpers for testing. Remember, the function passed to bind must return
// a monadic value!

var incRight = function(val) {
    return Either().Right(val + 1);
}

var plusFourRight = function(val) {
    return Either().Right(val + 4);
}

var tests = [

    // Test the Left identity.
    // bind(unit(x), f) ≡ f(x))
    function testFirstLaw() {
        // TODO
    },
    
    // Test the Right Identity.
    // bind(m, unit) ≡ m
    function testSecondLaw() {
        // TODO
    },

    // Test for Associativity.
    // bind(bind(m, f), g) ≡ bind(m, lambda x => bind(f(x), g))
    function testThirdLaw() {
        // TODO
    },

    // Test that of wraps a value in the Right monad.
    function testOfWrapsValInRight() {
        return Either().of("foo").right() === "foo";
    },

    // Binding a function on Left should have no effect on the value held by
    // it.
    function testBindingOnLeftIsNoOp() {
        return Either().Left(10).bind(function(x) {
            return x + 1;
        }).left() === 10;
    },

    // Binding a function on Right should modify the value held in that
    // instance of Right.
    function testBindingOnRight() {
        var test1 = Either().Right(10).bind(function(x) {
            return Either().Right(x + 1);
        }).right() === 11;
        
        var test2 = Either().Right(10).bind(incRight).right() === 11;

        return test1 && test2;
    },

    // You can bind things multiple times in a pretty, vertical fashion.
    function testMultipleBinds() {
        return Either().Right(10)
            .bind(incRight)
            .bind(incRight)
            .bind(incRight)
            .right() === 13;
    },

    // Same as above, but we are binding multiple anonymous functions.
    function testMultipleBindsWithAnonymousFunctions() {
        return Either().Right(10).bind(function(x) {
            return Either().Right(x + 1);
        }).bind(function(x) {
            return Either().Right(x + 1);
        }).right() === 12
    },

    // We can continue doing operations even after we find a failure. Those
    // operations just won't have any effect on our output.
    function testFailureDuringBind() {
        return Either().Right(10).bind(function(x) {
            return Either().Right(x + 1); // increment once
        }).bind(function(x) {
            if (x === 0) {
                return Either().Right(x + 1);
            } else {
                return Either().Left("found a failure"); // uh, oh, we failed
            }
        }).bind(function(x) {
            return Either().Right(x + 1); // we can still try other ops
        }).left() === "found a failure";
    },

    // Calling right() on a Right should return the unwrapped value.
    function testExtractingAValueFromRight() {
        return Either().Right(10).right() === 10;
    },

    // Calling left() on a Left should return the unwrapped value.
    function testExtractingAValueFromLeft() {
        return Either().Left(10).left() === 10;
    },
]

// Run all of the tests.
tests.map(function(x) {
    console.log(x());
});
