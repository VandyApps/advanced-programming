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
    return users.filter(function(user) {
        return user.married === false;
    });
}
