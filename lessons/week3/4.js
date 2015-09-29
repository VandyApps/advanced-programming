// Need to perform null-checks to make sure that our properties have values.

function getCoordinates(response) {
    var latitude,
        longitude;

    if (response !== null && response.location !== null 
        && response.location.city !== null 
        && response.location.city.coordinates != null) {
        latitude = response.location.city.coordinates.latitude;
        longitude = response.location.city.coordinates.longitude;

        if (latitude === null || longitude === null) {
            throw "Error: Coordinates cannot be null";
        }
    } else {
        throw "Error: Response object did not contain coordinates.";
    }

    return [latitude, longitude];
}
