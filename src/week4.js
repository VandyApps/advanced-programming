/**
 * Week 4 - Async monad / Promises A+
 *
 * - Callback hell
 *
 * - Async monad
 *
 * - Promises | A+
 *
 * - Resources: 
 *      https://blog.jcoglan.com/2011/03/11/promises-are-the-monad-of-asynchronous-programming/
 *      http://brianmckenna.org/blog/category_theory_promisesaplus
 */

/* CALLBACK HELL */

// I just started a new job as a front-end developer. My first task is to
// create a web client for our photo export service. The user can provide their
// credentials to the application and press export.
//
// From my perspective, things are a lot more complicated. First, I have to
// trade the user credentials for an API Token (API call 1), then I have to use
// that API Token to retrieve a list of the users photos (API call 2). Then
// I need to pass that list to another API call that takes a list of photos and
// returns an AWS S3 link to download the zip (API call 3).
//
// Here are the endpoints:
//
// GET /login?username=username&password=password => response={'apiToken': 12345}
//
// GET /photos?apiToken=apiToken => response=['photoId1', 'photoId2', ...]
//
// GET /photos/export?apiToken=apiTokenphoto=photoId1&photo=photoId2&photo=photoId3 => response={'link': https://...}

// Here's my first stab at solving the problem:

$(window).load(function(){
    $('#submit').click(function() {
        $.get(
            '/login?username=' + $('username').val() + '&password=' + $('password').val(),
            function(data) {
                $.get(
                    '/photos?apiToken=' + data.apiToken,
                    function(data) {
                        var params = "";
                        for (int i = 0; i < data; i++) {
                            params += 'photo=' + data[i];
                            params += '&';
                        }
                        $.get(
                            '/photos/export?apiToken=' + apiToken + '&' + params,
                            function(data) {
                                $('#download-link').html(data.link);
                            }).fail(function() {
                                console.log("Error: Could not export photos.");
                            });
                    }).fail(function() {
                        console.log("Error: Could not retrieve photo Ids.");
                    });
            }).fail(function() {
                console.log("Error: Could not retrive API Token.");
            });
    });
});

// Welcome to callback hell.
//
// This code is virtually unreadable. Because we are dealing with asynchronous
// code, these callbacks are necessary to get our job done. For instance, we
// can't perform the request for photo Ids until we receive the response that
// contains our API token.
//
// How can we can refactor this code to be more manageable?

$(window).load(function(){
    $('#submit').click(function() {
        login(function(loginData) {
            getPhotos(loginData, function(photoIdData) {
                exportFiles(photoIdData, function(exportFilesData) {
                    $('#download-link').html(exportFilesData.link);
                });
            });
        });
    });
});

function login(callback) {
    $.get(
        '/login?username=' + $('username').val() + '&password=' + $('password').val(),
        callback
        ).fail(function() {
            console.log('Error: Could not retrieve API Token.');
    });
}

function getPhotos(data, callback) {
    $.get(
        '/photos?apiToken=' + data.apiToken,
        callback
        ).fail(function() {
            console.log('Error: Could not retrieve photo Ids.');
        })
}

function exportFiles(data, callback) {
    var params = "";
    for (int i = 0; i < data; i++) {
        params += 'photo=' + data[i];
        params += '&';
    }

    $.get(
        '/photos/export?apiToken=' + apiToken + '&' + params,
        callback
    ).fail(function() {
        console.log('Error: Could not export photos.');
    })
}

// Our code is much more readable now. What if this process required even more
// callbacks? Our indentation schema in the main function is already atrocious,
// but it could get even worse. How can we solve this problem?

/* Async Monad */

// Last week, we looked at the Maybe monad. The maybe monad allowed us to clean
// up null checking so that it was readable, flat, and managed by our monad
// instead of manually. Can we do something similar with asynchronous calls?

// "The Promise monad needs three things: a wrapper object, a unit function to
// wrap a value in this object, and a bind function to help us compose the
// above functions."
//
// Source: https://blog.jcoglan.com/2011/03/11/promises-are-the-monad-of-asynchronous-programming/
//
// What do our object, unit, and bind functions need to look like?

// For today's seminar, we aren't going to dive into the wrapper object
// (Promise). Instead, we'll just take a look at the unit and bind functions,
// then learn how to apply them.

// unit :: a -> Promise a
var unit = function(x) {
    return new Promise(x);
};

// bind :: Promise a -> (a -> Promise b) -> Promise b
var bind = function(input, f) {
    var output = new Promise();
    input.callback(function(x) {
        f(x).callback(function(y) {
            output.succeed(y);
        });
    });
    return output;
};

// Source https://blog.jcoglan.com/2011/03/11/promises-are-the-monad-of-asynchronous-programming/

// The unit function, similar to the unit function for our Maybe monad, simply
// wraps a variable in our promise object. The bind function, on the other
// hand, is a little more complicated.
//
// Let's first look at the type signature of bind. Similar to Maybe, bind takes
// a value that is wrapped in a promise (Promise a) and a function that
// transforms a value (a) into another value (b) that is then wrapped in
// a Promise (Promise b). Finally, the second value wrapped in its Promise is
// returned.
//
// This whole operation can be thought of as unwrapping a, transforming it into
// b, and returning a wrapped version of b.

// The JavaScript community created a specification called Promises/A+ that
// allows us to handle asnynchronous code more elegantly. Note that the
// Promises/A+ version of bind is called `then`.

// Here's where I disappoint everyone in the room: Promises/A+ doesn't actually
// specify a monad. It's close, but unfortunately the specification doesn't
// satisfy the three monad laws. If you are interested in reading more about
// why, check out this article:
//
// http://brianmckenna.org/blog/category_theory_promisesaplus

/* Promises/A+ */

// In the interest of learning something practical today, let's take a look at
// how the Promises/A+ specification can help us refactor our code anyways.
// Just because the specification isn't a monad doesn't mean we can't use our
// understanding of monads to think about how Promises work.

// Here's our refactored code that uses Promises.

$(window).load(function(){
    var username = $('#username').val();
    var password = $('#password').val();

    $('#submit').click(function() {
        var apiToken;
        login(username, password).then(function(token) {
            apiToken = token;
        }).then(function(token) {
            return getPhotos(apiToken);
        }).then(function(photoIds) {
            return exportFiles(apiToken, photoIds);
        }).then(function(link) {
            $('#download-link').html(link);
        }, failure(reason) {
            console.log(reason);
        });
    });
});

// Login and return the API Token for this user.
function login(username, password) {
    return new Promise(function(resolve, reject) {
        $.get(
            '/login?username=' + username + '&password=' + password,
            function(data) {
                resolve(data.apiToken);
            }).fail(function() {
                reject('Error: Could not retrieve API Token.');
            });
    });
}

// Gets a list of photoIds.
function getPhotos(apiToken) {
    return new Promise(function(resolve, reject) {
        $.get(
            '/photos?apiToken=' + apiToken,
            function(data) {
                resolve(data)
            }).fail(function() {
                reject('Error: Could not retrieve photo Ids.');
            });
    });
}

// Starts export and returns link for photos.
function exportFiles(apiToken, photoIds) {
    var params = "";
    for (int i = 0; i < photoIds; i++) {
        params += 'photo=' + photoIds[i];
        params += '&';
    }

    return new Promise(function(resolve, reject) {
        $.get(
            '/photos/export?apiToken=' + apiToken + '&' + params,
            function(data) {
                resolve(data.link);
            }
            ).fail(function() {
                reject('Error: Could not export photos.');
            });
    });
}

// Our new main function is clearly flatter, and we were able to pull our error
// handling into a single `failure` function. This is helpful when you want to
// update a status box in your UI with different messages for different failure
// reasons, but in the same way every time (same pop up or animation, etc).
//
// The `then` function behaves similarly to our `bind` function. The function
// that we pass to `then` takes the unwrapped result of the first promise (a),
// performs some calculation with it, and returns the result of the operation
// (b) wrapped in it's own Promise object.
//
// bind :: Promise a -> (a -> Promise b) -> Promise b

// Hopefully you can see how monads intersect with day-to-day programming that
// you might do in your job. While Promises don't obey the monad laws and
// therefore are not monads, they could certainly be made to conform to these
// laws, and some attempts have been made to take them in this direction.
