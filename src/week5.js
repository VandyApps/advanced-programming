/**
 * Week 4 - Either Monad
 *
 * - Left (error) | Right (result)
 *
 * - How this helps avoid the need for exceptions.
 *
 * - References:
 *   https://github.com/folktale/data.either/blob/master/lib/either.js#L81
 */

/* JavaScript Error Handling */

// In the Real World™, we can't always control what kind of data our functions
// receive. It is not uncommon for JavaScript library functions to have
// sanitization like this:

function usefulLibFunc(value) {
    if (value !== null && value !== 0 && typeof exports !== 'undefined' && typeof value === 'number') {
        return undefined;
    }

    // ... do something useful.
}

// Returning `undefined` indicates to our user that their input was invalid.
// When the user calls our function, they can explicitly check for `undefined`.

function foobar() {
    var retVal = usefulLibFunc(null);
    if (retVal === undefined) {
        console.log("Unexpected value found.");
    } else {
        console.log("Success.");
    }
}

// That can get a little tedious, but at least it works. But what happens if
// usefulLibFunc has a real reason to return `undefined` other than for
// indicating an error? For example:

function lastElement(array) {
    if (array.length > 0) {
        return array[array.length - 1];
    } else {
        return undefined;
    }
}

// In this case, we can't tell if the array length was less than 0, or if the
// last element in the array was already `undefined`. In a lot of cases, this
// is an important distinction.

/* Exceptions */

// To solve this problem, we can use exceptions to indicate special types of
// failures. The above code can be rewritten like so:

function lastElement(array) {
    if (array.length > 0) {
        return array[array.length - 1];
    } else {
        throw "Error: Array cannot be empty.";
    }
}

// This appears to solve our problem.

function doSomething() {
    var array = [];
    try {
        var last = lastElement(array);
        console.log(last);
    } catch (error) {
        console.log(error);
    }
}

// That seems perfect. Except, what happens if an exception is thrown during
// a map operation?

function doSomethingFunctional() {
    var userResponses = [[1, 2, 3], [1, 2], [], [4, 5], [1]];
    try {
        var lasts = userResponses.map(function(response) {
            return lastElement(response);
        });
        for (int i = 0; i < lasts.length; i++) {
            console.log(lasts[i]);
        }
    } catch (error) {
        console.log(error);
    }
}

// Oh no! Even though only the third array in our `userResponses` list is
// empty, none of the responses were printed! Instead, all we get is an error
// message.

// In some data sets, we may not care whether or not some of the operations
// fail, in fact, we expect some to. But we want to make sure that the
// operations that succeed can still be used. We can still check for errors in
// that computation at a later point, we are just lazier about doing so.

/* EITHER MONAD */

// The either monad allows us to perform these types of computations. The monad
// gives us a slick way to bubble errors up without unwinding the entire stack
// and losing however many computations we have already successfully completed.
//
// Either is defined in Haskell as the following:
// instance Monad (Either e) where
//         return = Right
//         Right m >>= k = k m
//         Left e  >>= _ = Left e
//
// Either only ever holds one value: Left or Right. Left is traditionally used
// for error messages, and Right (the 'Right' or correct answer) is used for
// successful operations. Let's implement it.

// Source: https://github.com/folktale/data.either/blob/master/lib/either.js#L81

// The constructors for Either are quite simple. Right and Left can each
// contain a value.

var clone = Object.create;

function Either() { }

Left.prototype = clone(Either.prototype);
function Left(a) {
  this.value = a;
}

Right.prototype = clone(Either.prototype);
function Right(a) {
  this.value = a;
}

// Constructors

Either.Left = function(a) {
    return new Left(a);
}

Either.prototype.Left = Either.Left;

Either.Right = function(a) {
    return new Right(a);
}

Either.prototype.Right = Either.Right;

// The bind function (which, remember, is required for us to obey the monad
// laws) applies a function to the value contained in Right, or does nothing to
// an Either of type `Left`. This means that errors can be propogated without
// doing any null checks.

Right.prototype.bind = function(f) {
    return f(this.value);
}

Left.prototype.bind = function(f) {
    return this;
}

Right.prototype.print = function() {
    console.log(this.value);
}

Left.prototype.print = function() {
    console.log(this.value);
}

// Let's try using our new Either monad with the last array element function
// from before.

function doSomething() {
    var array = [];
    var last;
    if (array.length === 0) {
        last = Either.Left("Error: Empty array.");
    } else {
        last = Either.Right(lastElement(array));
    }
    return last;
}

// Okay, I admit the benefits of Either may not be obvious in that example.
// That is in part because Either _really_ shines when you do functional
// programming.
//
// First, let's move our boilerplate length checking code into its own
// function.

function either(f, array) {
    if (array.length === 0) {
        return Either.left("Error: Empty array.");
    } else {
        return Either.Right(f(array));
    }
}

function doSomethingFunctional() {
    var userResponses = [[1, 2, 3], [1, 2], [], [4, 5], [1]];
    var lasts = userResponses.map(function(response) {
        return either(lastElement, response);
    });
    for (int i = 0; i < lasts.length; i++) {
        lasts[i].print();
    }
} // ==> 3\n 2\n Error: Empty array.\n 5\n 1

// As you can see, we were able to successfully complete all of our other
// operations despite the fact that one of the arrays was empty. If our
// computations are dependent on previous computations succeeding, this can
// save us a lot of headache of having to solve the problem and then re-run all
// of our previous computations again. If those operations involved side
// effects, we might even have to do some work undoing those effects before our
// re-run.
//
// All in all, the Either monad can save us a lot of headache and help us write
// JavaScript code that is far more functional and lazy than with native
// exception handling. And sometimes, that's A Good Thing™.
