var johnDoe = {
    id: 1,
    loggedIn: false
};

function userLogin(user) { 
    // loginStateChange is a closure – It captures the user object.
    var loginStateChange = function() {
        user.loggedIn = !user.loggedIn;
    }

    console.log(user.id);
}
