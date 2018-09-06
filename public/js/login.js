$.getScript("/js/js_cookie.js", function () {

    /* NORMAL LOGIN */

    $("form").submit(function () {
        var email = $("#email").val();
        var pass = $("#pass").val();
        $.ajax({
            url: 'https://worldclock-intern.herokuapp.com/login',
            type: 'POST',
            data: JSON.stringify({
                "email": email,
                "password": pass
            }),
            dataType: 'json',
            headers: {
                'Content-Type': "application/json; charset=utf-8",
                'Accept': 'application/json',
            },
            success: function (data, status, jqXHR) {
                Cookies.remove('city');
                Cookies.remove('country');
                Cookies.remove('ishome');
                sessionStorage.setItem("get_userid", data.user_id);
                sessionStorage.setItem("get_token", data.token);
                sessionStorage.setItem("get_email", email);
                sessionStorage.setItem("get_pass", data.has_pass);
                sessionStorage.setItem("get_displayname", data.displayname);
                // console.log(data.has_pass);
            },
            complete: function (xhr, data) {
                // console.log(xhr.status); // 200
                if (xhr.status == 200) {
                    swal("Success", "Login successfully", "success");
                    setTimeout(function () {
                        window.location.href = "/dashboard";
                    }, 200);
                } else swal("Failed!", "Login fail", "error");
            }
        });
        return false;
    });

    /* FACEBOOK CONNECT */
    $("#facebook-connect").click(function () {
        FB.login(function (response) {
            if (response.authResponse) {
                // console.log('Welcome!  Fetching your information.... ');
                FB.api('/me', function (response) {
                    // console.log('Good to see you, ' + response.name + '.');
                    var authResponse = FB.getAuthResponse();
                    $.ajax({
                        url: 'https://worldclock-intern.herokuapp.com/fblogin',
                        type: 'POST',
                        data: JSON.stringify(authResponse),
                        dataType: 'json',
                        headers: {
                            'Content-Type': "application/json; charset=utf-8",
                            'Accept': 'application/json',
                        },
                        success: function (data, status, jqXHR) {
                            sessionStorage.setItem("get_userid", data.user_id);
                            sessionStorage.setItem("get_token", data.token);
                            sessionStorage.setItem("get_email", data.email);
                            sessionStorage.setItem("get_pass", data.has_pass);
                            sessionStorage.setItem("get_displayname", data.displayname);
                        },
                        complete: function (xhr, data) {
                            // console.log(xhr.status); // 200
                            if (xhr.status == 200) {

                                swal("Success", "Login successfully", "success");
                                setTimeout(function () {
                                    window.location.href = "/dashboard";
                                }, 200);
                            } else swal("Failed!", "Login fail", "error")
                        }
                    });
                });
            } else {
                // console.log('User cancelled login or did not fully authorize.');
            }
        }, {
            scope: 'email'
        });
    });

    $("#fb-logout").click(function () {
        FB.logout(function (response) {
            // console.log("log out");
        });
    });


});
