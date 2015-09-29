var badResponse = {
    'location': null
}

var badResponse = {
    'location': {
        'country': 'USA',
        'city': {
            'name': 'Boston',
            'coordinates': null
        }
    }
}

// Retrieveing coordinates from these responses.

function getCoordinates(response) {
    var latitude = response.location.city.coordinates.latitude;
    var longitude = response.location.city.coordinates.longitude;
    return [latitude, longitude];
}

// Sometimes it succeeds...
var coords = getCoordinates(response); // => [1234, 2345]

// And sometimes it fails...
var coords = getCoordinates(badResponse);
// => Uncaught TypeError: Cannot read property 'latitude' of null
