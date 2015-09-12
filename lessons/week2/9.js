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

function sumIncome(users) {
    // Each element of the users array is selected and 
    // collapsed into the `initialValue` of 0.
    return users.reduce(function(prev, curr, index, array) {
        return prev.income + curr.income;
    }, 0);
}
