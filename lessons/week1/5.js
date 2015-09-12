function doSomething() {
    var envVar = "I'm part of the environment.";
    var paramVar = "I was passed as a parameter.";

    // Closure property – Anonymous functions can capture 
    // their environment.
    var closure = function(param) {
        console.log(envVar); // => "I'm part of the environment."
        console.log(param); // => "I was passed as a parameter."
    }

    closure(paramVar);
}
