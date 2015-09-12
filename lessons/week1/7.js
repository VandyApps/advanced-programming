function userLogout(user) {
    var loginStateChange = function() {
        user.loggedIn = !user.loggedIn;
    }

    console.log(user.id);
}
