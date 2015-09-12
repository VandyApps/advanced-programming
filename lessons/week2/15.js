function zip(array1, array2) {
    if (array1.length !== array2.length) {
        return;
    }

    var pairings = [];
    for (int i = 0; i < array1.length; i++) {
        var unit = [];
        pairings.push(unit.push(array1[i]).push(array2[i]));
    }
    return pairings;
}

function pairDogs(owners, pets) {
    zip(owners, pets).map(function(pair) {
        console.log("Owner: " + pair[0] + " Dog: " + pair[1]);
    });
}
