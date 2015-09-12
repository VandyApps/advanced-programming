// Lifted lambda.
function loginStateChange(user) {
    user.loggedIn = !user.loggedIn;
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
