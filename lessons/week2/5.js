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
    var unmarried = [];
    for (int i = 0; i < users.length; i++) {
        if (users[i].married === false) {
            unmarried.push(users[i]);
        }
    }
}
