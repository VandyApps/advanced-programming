var allUsers = [
    {
        'username': 'perlgirl',
        'married': true,
        'income': 1000
    },
    {
        'username': 'johnstack',
        'married': false,
        'income': 450
    },
    {
        'username': 'susyqueue',
        'married': true,
        'income': 300
    },
    {
        'username': 'marytrie',
        'married': true,
        'income': 760
    },
    {
        'username': 'davidheap',
        'married': true,
        'income': 980
    }
    {
        'username': 'annboolean',
        'married': false,
        'income': 200000000
    }
]

function sumMarriedIncome(users) {
    return users.filter(isMarried)
                .reduce(function(prev, curr, index, array) {
                    return prev.income + curr.income;
                }, 0)
}
