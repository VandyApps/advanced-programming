var femaleUsers = [
    {
        'username': 'perlgirl',
        'married': true
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
        'username': 'annboolean',
        'married': true
    }
]

function filterForUnmarried(users) {
    console.log(users);
    var new_users = users.filter(function(user) {
        return user.married === false;
    });
    console.log(users);
    console.log(new_users);
}

