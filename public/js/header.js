 $(window).load(function () {
  if (sessionStorage.getItem("get_token") != null) {
   localStorage.setItem("user_token", sessionStorage.getItem("get_token"));
   sessionStorage.removeItem("get_token");
   localStorage.setItem("user_email", sessionStorage.getItem("get_email"));
   sessionStorage.removeItem("get_email");
   localStorage.setItem("user_id", sessionStorage.getItem("get_userid"));
   sessionStorage.removeItem("get_userid");
   localStorage.setItem("user_pass", sessionStorage.getItem("get_pass"));
   sessionStorage.removeItem("get_pass");
   localStorage.setItem("user_displayname", sessionStorage.getItem("get_displayname"));
   sessionStorage.removeItem("get_displayname");
 }
 // console.log("token = " + localStorage.getItem("user_token"));
 // console.log("displayname = " + localStorage.getItem("user_displayname"));
 // console.log("email = " + localStorage.getItem("user_email"));
 // console.log("uid = " + localStorage.getItem("user_id"));

 $(".glostick__account-details__email").text((localStorage.getItem("user_email")=='null' ? "":localStorage.getItem("user_email")));
 $(".glostick__account-details__name").text((localStorage.getItem("user_displayname")=='null' ? "": localStorage.getItem("user_displayname")));
 $("#display-name").val((localStorage.getItem("user_displayname")=='null' ? "": localStorage.getItem("user_displayname")));
 $("#email-display").val((localStorage.getItem("user_email")=='null' ? "":localStorage.getItem("user_email")));
 if(localStorage.getItem("user_pass")==1) $('#change-password').show();
});

 $(function () {

   $("#world-clock-user-icon").on("click", function () {
     if ($(".glostick__menu--account").hasClass("glostick__menu--open")) {} else {


       $(".glostick__modal-bg").addClass("glostick__modal-bg--active");
       $(".glostick__menu--account").addClass("glostick__menu--open");
     }
   });

   $(".glostick__modal-bg").on("click", function () {
     if ($(".glostick__menu--account").hasClass("glostick__menu--open")) {
       $(".glostick__modal-bg").removeClass("glostick__modal-bg--active");
       $(".glostick__menu--account").removeClass("glostick__menu--open");
     }
   });

   $('#searchbox').keypress(function (e) {
     var str = $('#searchbox').val();
     if (e.keyCode == 13) {
       location.href = "/dashboard/search?keyword="+str;
     }
   });

 });

 function logout() {
   $.getScript("/js/js_cookie.js", function () {
     var d = {
       "token": localStorage.getItem("user_token")
     };
     $.ajax({
       url: 'https://worldclock-intern.herokuapp.com/logout',
       type: 'DELETE',
       data: JSON.stringify(d),
       dataType: 'json',
       headers: {
         'Content-Type': "application/json; charset=utf-8",
         'Accept': 'application/json',
         "Authorization": "Token token=" + d.token
       },
       complete: function (xhr) {
          // console.log(xhr.status); // 200
          if (xhr.status == 200) {
            localStorage.removeItem("user_token");
            localStorage.removeItem("user_email");
            localStorage.removeItem("user_id");
            localStorage.removeItem("user_displayname");
            localStorage.removeItem("user_pass");
            Cookies.remove('city');
            Cookies.remove('country');
            Cookies.remove('ishome');
            setTimeout(function () {
              window.location.href = "/";
            }, 500);
          } else {
            swal("Failed!", "Something wrong !!!", "error")
          }
        }
      });
   });
 }
