/** Week 1 - Introduction to functional programming in JavaScript

- Using a REPL.

- Welcome to JavaScript.

- Anonymous functions: Lambdas, closures, lambda lifting.

*/

// Normal function
function example1() {
    
    // We can set anonymous functions to variables.
    var lambda = function() {
        var a = 1;
        var b = 2;
        return a + b;
    };

    // We can call that function in our code.
    lambda(); // => 3

    // Our anonymous functions can take parameters.
    var paramLambda = function(a, b) {
        return a + b;
    };

    paramLambda(1, 2); // => 3

}

function example2() {

    var envVar = "I'm part of the environment.";
    var paramVar = "I was passed as a parameter.";

    // Closure property - Anonymous functions can capture their environment.
    var closure = function(param) {
        console.log(envVar); // => "I'm part of the environment."
        console.log(param); // => "I was passed as a parameter."
    }

    closure(paramVar);
    
}

// TODO: This example is not good. Fix.
function example3() {

    var johnDoe = {
        id: 1,
        loggedIn: false
    };


    // Consider a login function.
    function userLogin(user) { 
        // loginStateChange is a closure - It captures the user object.
        var loginStateChange = function() {
            if (user.loggedIn) {
                user.loggedIn = false;
            } else {
                user.loggedIn = true;
            }
        }

        console.log(user.id);
    }

    // What happens if we want to make a logout function? That function can
    // make use of the loginStateChange lambda, but right now we would have to
    // copy/paste the lambda.
    
    function userLogout(user) {
        var loginStateChange = function() {
            if (user.loggedIn) {
                user.loggedIn = false;
            } else {
                user.loggedIn = true;
            }
        }

        console.log(user.id);
    }
    
    // Lambda lifting is when you "lift" a lambda out of the function where it
    // resides and make it a top-level definition.
    //
    // When you lift a lambda, you must consider whether the lambda captures
    // its environment (is a closure). If it does, you must make parameters for
    // each environment variable that is captured (or encapsulate all of them
    // into an object) in the new top-level definition.
    
    // Lifted lambda.
    function loginStateChange(user) {
        if (user.loggedIn) {
            user.loggedIn = false;
        } else {
            user.loggedIn = true;
        }
    }

    // Now, we can rewrite our two functions that make use of the lambda.
    function userLogin(user) {
        loginStateChange(user);
        console.log(user.id);
    }

    function userLogout(user) {
        loginStateChange(user);
        console.log(user.id);
    }

}

