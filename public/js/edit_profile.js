 $(window).load(function () {
  var d = {"token": localStorage.getItem("user_token")};
  $.ajax({
    url: 'https://worldclock-intern.herokuapp.com/checktoken',
    type: 'POST',
    data: JSON.stringify(d),
    dataType: 'json',
    headers:{
      'Content-Type':"application/json; charset=utf-8",
      'Accept':'application/json',
      "Authorization": "Token token="+d.token
    },
    complete: function (xhr) {
                // console.log(xhr.status); // 200
                if(xhr.status==200) {
                }
                else {
                  localStorage.removeItem("user_token");
                  window.location.href = "/";
                }
              }
            });

  $(".glostick__account-details__email").text((localStorage.getItem("user_email")=='null' ? "":localStorage.getItem("user_email")));
  $(".glostick__account-details__name").text((localStorage.getItem("user_displayname")=='null' ? "": localStorage.getItem("user_displayname")));
  $("#display-name").val((localStorage.getItem("user_displayname")=='null' ? "": localStorage.getItem("user_displayname")));
  $("#email-display").val((localStorage.getItem("user_email")=='null' ? "":localStorage.getItem("user_email")));
  if(localStorage.getItem("user_pass")==1) $('#change-password').show();
});

 $(function () {
   $("#save-changes-btn-displayname").on("click", function () {
    $("#object-changed-alert").css("display","none");
    $("#object-failed-alert").css("display","none");
    var d = {
      "token": localStorage.getItem("user_token"),
      "name" : $("#display-name").val(),
      "user_id": localStorage.getItem("user_id")
    };
    $.ajax({
      url: 'https://worldclock-intern.herokuapp.com/updateprofile',
      type: 'POST',
      data: JSON.stringify(d),
      dataType: 'json',
      headers:{
        'Content-Type':"application/json; charset=utf-8",
        'Accept':'application/json',
        "Authorization": "Token token="+d.token
      },
      complete: function (xhr) {
        // console.log(JSON.parse(xhr.responseText)["message"]);
        if (xhr.status == 200) {
          localStorage.setItem("user_displayname", $("#display-name").val());
          $(".glostick__account-details__name").text($("#display-name").val());
          $("#object-changed-alert span").html("<strong>Display name</strong> changed successfully.");
          $("#object-changed-alert").css("display","block");
        } else {
          // console.log("change displayname failed");
          $("#object-failed-alert span").html("<strong>" + JSON.parse(xhr.responseText)["message"] + ".</strong>");
          $("#object-failed-alert").css("display","block");
        }
      }
    });
  });

   $('#change-password').on('submit', function(e) {
    e.preventDefault();
    $("#object-changed-alert").css("display","none");
    $("#object-failed-alert").css("display","none");

    var newpw = $("#new-password").val();
    var confirmpw = $("#confirm-password").val();

    if (newpw != confirmpw) {
      $("#object-failed-alert span").html("<strong>Passwords don't match.</strong>");
      $("#object-failed-alert").css("display","block");
      // $("#confirm-password")[0].setCustomValidity("Passwords don't match");
      // $("#confirm-password")[0].reportValidity("Passwords don't match");
    } else {
      var d = {
        "token": localStorage.getItem("user_token"),
        "current_password": $("#current-password").val(),
        "password": $("#new-password").val(),
        "confirm_password": $("#confirm-password").val()
      };
      $.ajax({
        url: 'https://worldclock-intern.herokuapp.com/password/change',
        type: 'POST',
        data: JSON.stringify(d),
        dataType: 'json',
        headers: {
          'Content-Type': "application/json; charset=utf-8",
          'Accept': 'application/json',
          "Authorization": "Token token="+d.token
        },
        complete: function (xhr) {
          if (xhr.status == 200) {
            // console.log(JSON.parse(xhr.responseText)["message"]);
            $("#object-changed-alert span").html("<strong>Password</strong> changed successfully.");
            $("#object-changed-alert").css("display","block");
          } else {
            // console.log("change password failed");
            $("#object-failed-alert span").html("<strong>" + JSON.parse(xhr.responseText)["message"] + ".</strong>");
            $("#object-failed-alert").css("display","block");
          }
        }
      });
    }
    
  });

 });
