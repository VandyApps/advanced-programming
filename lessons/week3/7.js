// Our function, rewritten with Maybe.

function getCoordinates(response) {
    if (Maybe(response) !== Nothing 
        && Maybe(response.location) !== Nothing && 
        Maybe(response.location.city) !== Nothing 
        && Maybe(response.location.city.coordinates) != Nothing) {
        var latitude = Maybe(response.location.city.coordinates.latitude);
        var longitude = Maybe(response.location.city.coordinates.longitude);

        if (latitude === Nothing || longitude === Nothing) {
            return "Error: Coordinates cannot be null";
        }
        return [latitude, longitude];
    } else {
        return "Error: Response object did not contain coordinates.";
    }
}
