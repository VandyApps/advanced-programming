// Our client, now with bind.

function getCoordinates(response) {
    var coordinates = Maybe(response).bind(function(r) {
        return r.location;
    }).bind(function(r) {
        return r.city;
    }).bind(function(r) {
        return r.coordinates;
    });

    var lat = coordinates.bind(function(r) {return r.latitude});
    var lon = coordinates.bind(function(r) {return r.longitude});

    if (lat === Nothing || lon === Nothing) {
        throw "Error: Coordinates cannot be null";
    }
    return [lat, lon];
}
