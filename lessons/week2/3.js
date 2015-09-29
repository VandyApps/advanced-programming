var users = [
    {
        'username': 'johnstack',
        'married': false
    },
    {
        'username': 'susyqueue',
        'married': false
    },
    {
        'username': 'marytrie',
        'married': false
    },
    {
        'username': 'davidheap',
        'married': false
    }
]

function updateUsers(users) {
    // This is read as: "For each user in a new array, let 
    // married be true."
    return users.map(function(user) {
        user.married = true;
        return user;
    });
}
