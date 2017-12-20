requirejs([
    'bower_components/jquery/dist/jquery',
    'bower_components/oauth2-client-js/dist/oauth2-client'
], function(jQuery, OAuth) {
    var timedelay = 100;
    var objects = [];

    var dataporten = new OAuth.Provider({
        id: 'dataporten',
        authorization_url: 'https://auth.dataporten.no/oauth/authorization'
    });

    try {
        var response = dataporten.parse(window.location.hash);
    } catch (e) {
        console.log(e);
    }

    if (!dataporten.hasAccessToken()) {
        $("#loginout").html('<a href="javascript:login();">Log in</a>');
    } else {
        $("#loginout").html('<a href="javascript:logout();">Log out</a>');

        (function fetchLoop() {
            $.ajax({
                url: 'https://kikora-test.dataporten-api.no/',
                headers: {"Authorization": "Bearer " + dataporten.getAccessToken()},
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + dataporten.getAccessToken());
                },
                success: function(data){
                    console.log(data);

                    $("#errors").empty();
                    for (var error in data.errors) {
                        $("#errors").append(data.errors[error]);
                    }

                    for (var i=0; i<data.data.length; i++) {
                        if (!objects.hasOwnProperty(data.data[i].organization.name)) {
                            objects[data.data[i].organization.name] = {};
                            objects[data.data[i].organization.name].current = data.data[i].solvedExercises.today - data.data[i].solvedExercises.lastMinute;
                        }

                        objects[data.data[i].organization.name].delta = (data.data[i].solvedExercises.today - objects[data.data[i].organization.name].current) / (60 * 1000 / timedelay);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown)   {
                    console.error(jqXHR);
                    console.error(textStatus);
                    console.error(errorThrown);
                }
            });

            setTimeout(fetchLoop, 60000);
        })();
    }

    login = function() {
        var request = new OAuth.Request({
            client_id: '2904ce9c-e111-448c-ad66-48c244c894c7',
            redirect_uri: 'https://kikora.github.io/dataporten-livecounter-app/'
        });

        dataporten.remember(request);

        window.location.href = dataporten.requestToken(request);
    }

    logout = function() {
        dataporten.deleteTokens();
        location.href = location.href.replace(location.hash, "");
        location.reload();
    }

    function viewLoop() {
        $("#data").empty();

        for (var k in objects) {
            obj = objects[k];
            $("#data").append(
                "<h2>" + k + "</h2>" +
                "Exercises solved today: " + Math.ceil(obj.current)
            );
            obj.current += obj.delta;
        }

        setTimeout(viewLoop, timedelay);
    }

    viewLoop();
});
