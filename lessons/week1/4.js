function doSomething(param1, param2) {
    // Our anonymous functions can take parameters.
    var paramLambda = function(a, b) {
        return a + b;
    };

    paramLambda(1, 2); // => 3
    paramLambda(2, 3); // => 5
    paramLabmda(3, 4); // => 7
}
