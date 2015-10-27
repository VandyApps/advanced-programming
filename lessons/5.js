$(window).load(function(){
    var username = $('#username').val();
    var password = $('#password').val();

    $('#submit').click(function() {
        var apiToken;
        login(username, password).then(function(token) {
            apiToken = token;
        }).then(function(token) {
            return getPhotos(apiToken);
        }).then(function(photoIds) {
            return exportFiles(apiToken, photoIds);
        }).then(function(link) {
            $('#download-link').html(link);
        }, failure(reason) {
            console.log(reason);
        });
    });
});

// Login and return the API Token for this user.
function login(username, password) {
    return new Promise(function(resolve, reject) {
        $.get(
            '/login?username=' + username + '&password=' + password,
            function(data) {
                resolve(data.apiToken);
            }).fail(function() {
                reject('Error: Could not retrieve API Token.');
            });
    });
}

// Gets a list of photoIds.
function getPhotos(apiToken) {
    return new Promise(function(resolve, reject) {
        $.get(
            '/photos?apiToken=' + apiToken,
            function(data) {
                resolve(data)
            }).fail(function() {
                reject('Error: Could not retrieve photo Ids.');
            });
    });
}

// Starts export and returns link for photos.
function exportFiles(apiToken, photoIds) {
    var params = "";
    for (int i = 0; i < photoIds; i++) {
        params += 'photo=' + photoIds[i];
        params += '&';
    }

    return new Promise(function(resolve, reject) {
        $.get(
            '/photos/export?apiToken=' + apiToken + '&' + params,
            function(data) {
                resolve(data.link);
            }
            ).fail(function() {
                reject('Error: Could not export photos.');
            });
    });
}
