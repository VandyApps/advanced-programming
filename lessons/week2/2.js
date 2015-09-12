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
    for (int i = 0; i < users.length; i++) {
        users[i].married = true;
    }
}
