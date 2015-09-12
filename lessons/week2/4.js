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

function getNewlyWeds(users) {
    var usernames = users.map(function(user) {
        return user.username;
    });

    console.log(usernames); // => ['johnstack','susyqueue', 
                            //     'marytrie', 'davidheap']
}
