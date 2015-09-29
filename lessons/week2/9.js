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
    // Each element of the users array is selected and 
    // collapsed into the `initialValue` of 0.
    return users.reduce(function(prev, curr, index, array) {
        return prev + curr.income;
    }, 0);
}
