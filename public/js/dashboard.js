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
 // console.log("user:" + localStorage.getItem("user_email"));
 var title = localStorage.getItem("user_displayname")=='null' ? localStorage.getItem("user_email") : localStorage.getItem("user_displayname"); 
 $(document).prop('title', (title=='null'? "WorldClock":"WorldClock - " +title));
 var token = sessionStorage.getItem("user_token");
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

 eventlist.setEvent();
 $(".glostick__account-details__email").text((localStorage.getItem("user_email")=='null' ? "":localStorage.getItem("user_email")));
 $(".glostick__account-details__name").text((localStorage.getItem("user_displayname")=='null' ? "": localStorage.getItem("user_displayname")));

 if (window.location.pathname == "/dashboard/search") {
  $("#searchbox").val(getKeyword());
}
});

 $(function () {
  // $("#world-clock-menu-icon").on("click", function () {
  //   if ($(".glostick__menu--navigator").hasClass("glostick__menu--open")) {} else {


  //     $(".glostick__modal-bg").addClass("glostick__modal-bg--active");
  //     $(".glostick__menu--navigator").addClass("glostick__menu--open");
  //   }
  // });

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

 function getKeyword() {
   var keyword = window.location.search;
   keyword = keyword.split("=");
   return decodeURI(keyword[1]);
 }

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
          }, 200);
        } else {
          swal("Failed!", "Something wrong !!!", "error")
        }
      }
    });
  });
}
