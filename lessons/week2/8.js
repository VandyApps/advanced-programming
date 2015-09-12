var femaleUsers = [
    {
        'username': 'perlgirl',
        'income': 1000
    },
    {
        'username': 'susyqueue',
        'income': 2000
    },
    {
        'username': 'marytrie',
        'income': 500
    },
    {
        'username': 'annboolean',
        'income': 200000000
    }
]

function sumIncome(users) {
    var total = 0;
    for (int i = 0; i < users.length; i++) {
        total += users[i].income
    }
    return total;
}
