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

var data = {
    'apiToken': 1234
}

var apiToken = bind(myPromise, function(data) {
    return data.apiToken;
})

v$.get(
    "/login?username=me&password=foo",
    function(data) {
        $(document).set(data.apiToken);
    }, fail {

    }
)
