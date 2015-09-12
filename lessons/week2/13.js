var owners = ['susyqueue', 'annboolean', 'johnstack', 'daveheap'];
var pets = ['sam', 'scout', 'old yeller', 'buddy'];

function pairDogs(owners, pets) {
    if (owners.length !== dogs.length) {
        return;
    }

    var pairings = [];
    for (int i = 0; i < owners.length; i++) {
        var unit = [];
        unit.push(owners[i]);
        unit.push(dogs[i]);
        pairings.push(unit);
    }

    pairings.map(function(pair) {
        console.log("Owner: " + pair[0] + " Dog: " + pair[1]);
    });
}
