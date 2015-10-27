$(window).load(function(){
    $('#submit').click(function() {
        $.get(
            '/login?username=' + $('username').val() + '&password=' + $('password').val(),
            function(data) {
                $.get(
                    '/photos?apiToken=' + data.apiToken,
                    function(data) {
                        var params = "";
                        for (int i = 0; i < data; i++) {
                            params += 'photo=' + data[i];
                            params += '&';
                        }
                        $.get(
                            '/photos/export?apiToken=' + apiToken + '&' + params,
                            function(data) {
                                $('#download-link').html(data.link);
                            }).fail(function() {
                                console.log("Error: Could not export photos.");
                            });
                    }).fail(function() {
                        console.log("Error: Could not retrieve photo Ids.");
                    });
            }).fail(function() {
                console.log("Error: Could not retrive API Token.");
            });
    });
});

$.get(
    "/login?username=me&password=foo",
    function(data) {
        console.log(data.message);
        return data.apiToken;
    }
    )
