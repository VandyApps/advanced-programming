function doSomething(param1, param2) {
    // We can set anonymous functions to variables.
    var myFunc = function() {
        var a = 1;
        var b = 2;
        return a + b;
    };

    // We can call that function in our code.
    myFunc(); // => 3
}
