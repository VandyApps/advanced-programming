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

function isMarried(user) {
    return user.married === true;
}

function filterForUnmarried(users) {
    return users.filter(!isMarried);
}
