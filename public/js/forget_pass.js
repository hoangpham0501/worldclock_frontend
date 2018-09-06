$(document).ready(function () {

    /* ---------TRANSITION EFFECT--------- */

    var transition = function (formObject) {
        var $anchor = $(formObject).children("button.scroll2");
        var $section = $anchor.attr('data-section');
        if ($section === '2' || $section === '3') {
            $('#wrap .wrap-inner').addClass('goto-' + $section);
        }
        else {
            $('#wrap .wrap-inner').removeClass('goto-2 goto-3');
        }
    };


    /* ---------EMAIL FORM SUBMIT--------- */

    $(".email-form").on('submit', function (e) {
        e.preventDefault();

        var email = $("#email").val();
        var formObject = this;

        $.ajax({
            url: 'https://worldclock-intern.herokuapp.com/password/forgot',
            type: 'POST',
            data: JSON.stringify({
                "email" : email
            }),
            dataType: 'json',
            headers: {
                'Content-Type': "application/json; charset=utf-8",
                'Accept': 'application/json',
            },
            complete: function (xhr, data) {
                if (xhr.status == 200) {
                    transition(formObject);
                } else if (xhr.status = 404) swal("Failed!", "Email doesn't exist , please try again", "error");
                else if (xhr.status = 404) swal("Failed!", "Something wrong , please try again", "error");
            }
        });

    });


    /* ---------CODE FORM SUBMIT--------- */

    $(".code-form").on('submit', function (e) {
        e.preventDefault();
        var formObject = this;

        var seccode = $("#seccode").val();
        $.ajax({
            url: 'https://worldclock-intern.herokuapp.com/password/checkcode',
            type: 'POST',
            data: JSON.stringify({
                "code": seccode
            }),
            dataType: 'json',
            headers: {
                'Content-Type': "application/json; charset=utf-8",
                'Accept': 'application/json',
            },
            complete: function (xhr, data) {
                if (xhr.status == 200) {
                    sessionStorage.setItem("sec_code", seccode);
                    transition(formObject);
                } else swal("Failed!", "Incorrect security code", "error");
            }
        });
    });

    /*----------CHECK MATCHING PASSWORDS----------*/

    var password = document.getElementById("password");
    var confirm_password = document.getElementById("confirm_password");

    function validatePassword() {
        if (password.value != "" && confirm_password.value != "" && password.value != confirm_password.value) {
            confirm_password.setCustomValidity("Passwords don't match");
        }
        else {
            confirm_password.setCustomValidity("");
        }
    }
    password.onchange = validatePassword;
    confirm_password.onkeyup = validatePassword;

    /* -------PASSWORD FORM SUBMIT------- */

    $(".pass-form").on('submit', function (e) {
        e.preventDefault();
        var seccode = sessionStorage.getItem("sec_code");
        var password = $("#password").val();
        var confirm_password = $("#confirm_password").val();

        $.ajax({
            url: 'https://worldclock-intern.herokuapp.com/password/reset',
            type: 'POST',
            data: JSON.stringify({
                "code": seccode,
                "password": password,
                "confirm_password": confirm_password
            }),
            dataType: 'json',
            headers: {
                'Content-Type': "application/json; charset=utf-8",
                'Accept': 'application/json',
            },
            complete: function (xhr, data) {
                if (xhr.status == 200) {
                    swal("Success", "Reset password successfully", "success");
                    setTimeout(function () {
                        window.location.href = "/login";
                    }, 500);
                } else if (xhr.status == 412) swal("Failed!", "Passwords don't match !! Please try again.", "error");
                else swal("Failed!", "Reset password failed !", "error");
            }
        });

    });

});
