// Our getter, now using a fully-featured Maybe monad.

function getCoordinates(response) {
    return Maybe(response).bind(function(r) {
        return r.location;
    }).bind(function(r) {
        return r.city;
    }).bind(function(r) {
        return r.coordinates;
    }).maybe("Error: Coordinates cannot be null", function(r) {
        return [r.latitude, r.longitude];
    });
}
