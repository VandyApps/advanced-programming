$(window).load(function(){
    $('#submit').click(function() {
        login(function(loginData) {
            getPhotos(loginData, function(photoIdData) {
                exportFiles(photoIdData, function(exportFilesData) {
                    $('#download-link').html(exportFilesData.link);
                });
            });
        });
    });
});

function login(callback) {
    $.get(
        '/login?username=' + $('username').val() + '&password=' + $('password').val(),
        callback
        ).fail(function() {
            console.log('Error: Could not retrieve API Token.');
    });
}

function getPhotos(data, callback) {
    $.get(
        '/photos?apiToken=' + data.apiToken,
        callback
        ).fail(function() {
            console.log('Error: Could not retrieve photo Ids.');
        })
}

function exportFiles(data, callback) {
    var params = "";
    for (int i = 0; i < data; i++) {
        params += 'photo=' + data[i];
        params += '&';
    }

    $.get(
        '/photos/export?apiToken=' + apiToken + '&' + params,
        callback
    ).fail(function() {
        console.log('Error: Could not export photos.');
    })
}
