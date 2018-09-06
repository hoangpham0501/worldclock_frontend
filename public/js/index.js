 $(function () {
   var bindDatePicker = function(){
    $(".date").datetimepicker({
     minDate: moment(moment().format('ddd DD MMM YYYY'),"ddd DD MMM YYYY'"),
     useCurrent: true,
     showClose:true,
     keepOpen:false,
     format:'ddd DD MMM YYYY',
     icons: {
      time: "fa fa-clock-o",
      date: "fa fa-calendar",
      up: "fa fa-arrow-up",
      down: "fa fa-arrow-down"
    }
  }).find('input:first').on("blur",function () {
      // check if the date is correct. We can accept dd-mm-yyyy and yyyy-mm-dd.
      // update the format if it's yyyy-mm-dd
      var date = parseDate($(this).val());
      if (! isValidDate(date)) {
        //create date based on momentjs (we have that)
        date = moment().format('ddd DD MMM YYYY');
      }
      $(this).val(date);
    });
}

var isValidDate = function(value, format){
  format = format || false;
    // lets parse the date to the best of our knowledge
    if (format) {
      value = parseDate(value);
    }
    var timestamp = Date.parse(value);
    return isNaN(timestamp) == false;
  }

  var parseDate = function(value){
    var m = value.match(/^(\d{3})(\/|-)?(\d{1,2})(\/|-)?(\d{1,2})(\/|-)?(\d{4})$/);
    if (m)
     value = m[5] + '-' + ("00" + m[3]).slice(-2) + '-' + ("00" + m[1]).slice(-2);
   return value;
 }
 bindDatePicker();
});


 (function($) {
  $(document).ready(function() {

    /* Google Calendar click event */

    $('#gg-calendar').on('click',function(){
      window.open(updateGgCalendarLink(getEventName(),
        getPlaces(),
        getStartTime(),
        getHomeOffset(),
        getDuration()), '_blank');
    })

    /* Get Recommend Time click event */

    $('#recommend-time').on('click',function(){
      $("#object-changed-alert").css("display","none");
      $("#object-failed-alert").css("display","none");
      var pair = getRecommendTime(getCitiesOffset());

        // calculate start and stop time
        var start, stop;
        if (pair[0] > pair[1]) {
          start = {hour: 0, minute: 0};
          stop = {hour: 0, minute: 0};
          $("#object-failed-alert").slideDown();
        } else {
          start = { hour: Math.floor(pair[0] / 60), minute: pair[0] % 60};
          stop = { hour: Math.floor(pair[1] / 60), minute: pair[1] % 60};
          $("#object-changed-alert").slideDown();
        }

        // move bars
        moveLeftRight(start, stop);

        // set the text
        var start_s = (start.hour<10 ? "0" +start.hour : start.hour) + ':' + (start.minute || '00');
        $("#time-display-1").text(start_s);
        var duration = { hour: Math.max(0,Math.floor((pair[1] - pair[0]) / 60)), minute: Math.max(0,(pair[1] - pair[0]) % 60)};
        var duration_s = (duration.hour<10 ? "0" +duration.hour : duration.hour) + ':' + (duration.minute || '00');
        $("#time-display-2").text(duration_s);
      })

    var timepicker1 = new TimePicker(['time-input-1', 'time-input-2'], {
      lang: 'en',
      theme: 'blue-grey'
    });
    timepicker1.on('change', function(evt) {

      var curStarttimeNum1 = calcTime($("#time-display-1").text());
      var curStarttimeNum2 = calcTime($("#time-display-2").text());

      if (evt.element.id == 'time-input-1') {
        if(!evt.hour) evt.hour=parseInt(app.startH);
        if(!evt.minute) evt.minute=parseInt(app.startM);
        var value = (evt.hour<10 ? "0" +evt.hour : evt.hour) + ':' + (evt.minute || '00');
        var newStarttime = calcTime(value);
        var maxStarttime = 24 * 60 - parseInt(curStarttimeNum2);
        if (newStarttime > maxStarttime) {
          swal("Start Time Limit Exceeded!", "You can't make an event passing the midnight in your home timezone. You can only set a start time before " + convertTime(maxStarttime), "error");
        } else {
          $("#time-display-1").text(value);
          moveLeft(evt);
        }
      } else if (evt.element.id == 'time-input-2') {
        if(!evt.hour) evt.hour=parseInt(app.durationH);
        if(!evt.minute) evt.minute=parseInt(app.durationM);
        var value = (evt.hour<10 ? "0" +evt.hour : evt.hour) + ':' + (evt.minute || '00');
        var newDuration = calcTime(value);
        var maxDuration = 24 * 60 - parseInt(curStarttimeNum1);
        if (newDuration > maxDuration) {
          swal("Duration Limit Exceeded!", "You can't make an event passing the midnight in your home timezone. You can only set a maximum duration of " + convertTime(maxDuration), "error");
        } else {
          $("#time-display-2").text(value);
          moveRight(evt);
        }
      }
    });
  });
  var moveLeft = function(evt) {
    var pos = $('.barLeft').position().left;
    var duration = app.bar[1] - app.bar[0] - 3;
    var add = ((evt.hour || 0) - app.startH) * 34 + ((evt.minute || 0) - app.startM) / 5 * 2.83325;
    $('.barLeft').animate({
      left: pos + add
    }, 200, function() {
      app.startH = (evt.hour || 0);
      app.startM = (evt.minute || 0);
      app.bar[0] = pos + add;
      app.bar[1] = pos + add + duration + 3;
      app.bar[2] = pos + add + 3;
      setTitleCurBar();
    })
    $('.duration').animate({
      left: pos + add + 3,
    }, 200);
    $('.barRight').animate({
      left: pos + add + duration + 3
    }, 200)
    $("#object-changed-alert").slideUp();
    $("#object-failed-alert").slideUp(); 
  }

  var moveRight = function(evt) {
    var pos = $('.barRight').position().left;
    var duration = app.bar[1] - app.bar[0] - 3;
    var add = ((evt.hour || 0) - app.durationH) * 34 + ((evt.minute || 0) - app.durationM) / 5 * 2.83325;
    $('.duration').animate({
      width: duration + add
    }, 200);
    $('.barRight').animate({
      left: pos + add
    }, 200, function() {
      app.durationH = (evt.hour || 0);
      app.durationM = (evt.minute || 0);
      app.bar[1] = pos + add;
      setTitleCurBar();
    })
    $("#object-changed-alert").slideUp();
    $("#object-failed-alert").slideUp(); 
  }
})(jQuery);

$(window).load(function() {
  if(sessionStorage.getItem("get_token") != null){
    localStorage.setItem("user_token",sessionStorage.getItem("get_token"));
    sessionStorage.removeItem("get_token");
    sessionStorage.getItem("get_email");
    localStorage.setItem("user_email",sessionStorage.getItem("get_email"));
    sessionStorage.removeItem("get_email");

    if(localStorage.getItem("user_token") != null){
      $(".is_user").css("display","block");
      $(".non_user").css("display","none");
    }
    else if(localStorage.getItem("user_token") == null){
      $(".non_user").css("display","block");
      $(".is_user").css("display","none");
    }
  }

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
                }
              }
            });


  if(localStorage.getItem("user_token") != null){
    $(".greets").text("Hello, "+localStorage.getItem("user_email"));
    $(".is_user").css("display","block");
    $(".non_user").css("display","none");
  }
  else if(localStorage.getItem("user_token") == null){
    $(".non_user").css("display","block");
    $(".is_user").css("display","none");
  }
});
function logout(){
  localStorage.removeItem("user_token");
  localStorage.removeItem("user_email");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_displayname");
  localStorage.removeItem("user_pass");
  window.location ="/";
}

(function($){
  $(document).ready(function(){

    /*---------------------------Edit event's name--------------------*/
    $("#event-name-edit").on("click", function() {
      // $("#event-name-input").removeAttr("width");
      var currentEventName = $("#event-name").text();
      $(".event-name-display").css('display', 'none');
      $(".event-name-ctr").css('display', 'block');
      $("#event-name-input").val(currentEventName);
      $("#event-name-input").focus();
    });

    $("#event-name-save").on("click", function() {
      var newEventName = $("#event-name-input").val();
      $(".event-name-ctr").css('display', 'none');
      $(".event-name-display").css('display', 'block');
      $("#event-name").text(newEventName);
      updateGgCalendarLink(getEventName(), getPlaces(), getStartTime(), getHomeOffset(), getDuration());
    });

    $("#event-name-cancel").on("click", function() {
      $(".event-name-ctr").css('display', 'none');
      $(".event-name-display").css('display', 'block');
    });
  });
})(jQuery);

function calcTime(timeStr) {
  var starttimeint = 0;

  var idx = 0;
  while (idx < timeStr.length && timeStr[idx] != ':') {
    starttimeint = starttimeint * 10 + parseInt(timeStr[idx]);
    idx++;
  }
  starttimeint *= 60;
  idx++;
  var starttimeMin = 0;
  while (idx < timeStr.length) {
    starttimeMin = starttimeMin * 10 + parseInt(timeStr[idx]);
    idx++;
  }
  starttimeint += starttimeMin;
  return starttimeint;
}

function convertTime(timeInt) {
  var timeConvertStr;

  timeConvertStr = Math.floor(parseInt(timeInt) / 60);
  if (timeConvertStr == "0" || timeConvertStr == "5") timeConvertStr = "0" + timeConvertStr;
  timeConvertStr += ":";

  var timeMinute =  parseInt(timeInt) % 60;
  if (timeMinute == "0" || timeMinute == "5") timeMinute = "0" + timeMinute;
  timeConvertStr += timeMinute;

  return timeConvertStr;
}

function getEventId() {
  var sPageURL = window.location.pathname;
  var eventid = sPageURL.split('/')[2];
  // console.log("eventid = " + eventid);
  return eventid
}

/*-------------------- GOOGLE CALENDAR --------------------*/

var getHomeId = function () {
  for(var i = 0; i < app.cities.length; i++)
    if (app.cities[i].home) return i;
}

function getEventName() {
  return $("#event-name").text();
}

function getPlaces() {
  var places = [];

  // push home's name first
  var homeid = getHomeId();
  places.push(app.cities[homeid].name + ", " + app.cities[homeid].country);

  // push other places name
  for(var i = 0; i < app.cities.length; i++) {
    if (i == homeid) continue;
    places.push(app.cities[i].name + ", " + app.cities[i].country);
  }

  return places;
}

const DATETIME_FORMAT = "DD-MM-YYYY HH:mm:ss";
function getStartTime() {
  var startTime = [];

  // calculate home's info
  var date = moment($("#momentDate").val(), "ddd DD MMM YYYY").format("DD-MM-YYYY");
  var time = $("#time-display-1").text(); time += ":00";
  startTime.push(date + ' ' + time);
  var homedt = moment(date + ' ' + time, DATETIME_FORMAT, true);

  // find home id;
  var homeid = getHomeId();
  // console.log("homeid starttime = " + homeid);

  // calculate other cities's start datetime
  for(var i = 0; i < app.cities.length; i++) {

    if (i == homeid) continue;

    var delta = app.cities[i].timezone - app.cities[homeid].timezone;
    var curdt = homedt.clone().add(delta, 'hours');
    startTime.push(curdt.format(DATETIME_FORMAT));
  }

  return startTime;
}

function getHomeOffset() {
  return app.cities[getHomeId()].timezone;
}

function getDuration() {
  return moment.duration($("#time-display-2").text()).asMinutes();
}

var updateGgCalendarLink = function(eventName, places, startTime, homeOffset, duration) {
    // startTime format
    const UTC_FORMAT = "YYYYMMDDTHHmmss\\Z";

    var link = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    link += '&text=' + eventName;

    // convert home's local time to UTC
    var homeStartTime = moment(startTime[0], DATETIME_FORMAT, true).subtract(homeOffset, 'hours');
    var homeEndTime   = homeStartTime.clone().add(duration, 'minutes');
    var utcStartTime = homeStartTime.format(UTC_FORMAT);
    var utcEndTime   = homeEndTime.format(UTC_FORMAT);
    link += "&dates=" + utcStartTime + "/" + utcEndTime;

    // description for the event
    link += "&details=";
    var n = places.length;
    for(var i = 0; i < n; i++) {

      link += "%0A%0A" + places[i] + "%0A";

      var start = moment(startTime[i], DATETIME_FORMAT, true);
      var end   = start.clone().add(duration, 'minutes');

      link += start.format("HH:mm") + "%09" + moment.weekdaysShort()[start.weekday()] + ", " + moment.monthsShort()[start.month()] + ' ' + start.date() + ' ' + start.year();
      link += "%0A";
      link += end.format("HH:mm") + "%09" + moment.weekdaysShort()[end.weekday()] + ", " + moment.monthsShort()[end.month()] + ' ' + end.date() + ' ' + end.year();
    }
    link += "%0A%0A%0AScheduled with World Clock%0A";
    link += "&location&trp=true&sf=true&output=xml";

    // update <a>'s href attribute
    // $('#gg-calendar').attr('href', link);
    return link;
  }

  /*-------------------- RECOMMEND TIME --------------------*/

  var moveLeftRight = function(evt, evt1) {
    var pos = $('.barLeft').position().left;
    var duration = ((evt1.hour || 0) - evt.hour) * 34 + ((evt1.minute || 0) - evt.minute) / 5 * 2.83325;
    var add  = ((evt.hour || 0) - app.startH) * 34 + ((evt.minute || 0) - app.startM) / 5 * 2.83325;
    $('.barLeft').animate({
      left: pos + add
    }, 200, function() {
      app.startH = (evt.hour || 0);
      app.startM = (evt.minute || 0);
      app.bar[0] = pos + add;
      app.bar[1] = pos + add + duration + 3;
      app.bar[2] = pos + add + 3;
      app.durationH = (evt1.hour || 0) - evt.hour;
      app.durationM = (evt1.minute || 0) - evt.minute;
      setTitleCurBar();
    })
    $('.duration').animate({
      left: pos + add + 3,
      width: duration
    }, 200);
    $('.barRight').animate({
      left: pos + add + duration + 3
    }, 200)
    
  }

  // 5.2 -> 5       -5.2 -> -5
  // 5.5 -> 6       -5.5 -> -6
  // 5.8 -> 6       -5.8 -> -6
  function roundHalfUpSymmetric(x) {
    if (x >= 0) return Math.round(x);
    return (x % 0.5 == 0) ? Math.floor(x) : Math.round(x);
  }

  function getCitiesOffset() {
    var offset = [];

    // we want offset[0] is home's
    var homeid = getHomeId();
    offset.push(app.cities[homeid].timezone);

    // then push others's offset to last
    for(var i = 0; i < app.cities.length; i++) {
      if (i == homeid) continue;
      offset.push(app.cities[i].timezone);
    }

    return offset;
  }


// timeOffsets is in hour
// timeOffsets[0] is home
function getRecommendTime(timeOffsets) {
  // init (for home - timeOffsets[0])
  var start = 8 * 60;     // 08:00
  var end = 18 * 60 - 5;  // 17:55
  var i = start;
  var j = end;
  var homeOffset = timeOffsets[0] * 60;

  // minimize working times using i and j
  for(var city = 1; city < timeOffsets.length; city++) {
    var offset = timeOffsets[city] * 60;
    var delta = homeOffset - offset;

      // minimize i j
      i = Math.max(i, start + delta);
      j = Math.min(j, end + delta);
    }

  // half round to integer
  i = roundHalfUpSymmetric(i);
  j = roundHalfUpSymmetric(j);

  // % 5 == 0
  i = (i % 5 < 5 - (i % 5)) ? (i - (i % 5)) : (i + 5 - (i % 5));
  j = (j % 5 < 5 - (j % 5)) ? (j - (j % 5)) : (j + 5 - (j % 5));
    // return result
    var pair = [i, j];
    return pair;
  }
  
  var setEventLink = function(){
    eventid = getEventId();
    var d = {"longUrl": "https://intern-worldclock.herokuapp.com/event/"+eventid};
    $.ajax({
      url:"https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyDwLgzVhaYkCQpM5aIp5ClT4BHrx9uepNw",
      type: "POST",
      data: JSON.stringify(d),
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      success:function(data){
        app.link=data.id;
      },
    })
  }

  var setTitleCurBar = function(){
    var titleLeft = (parseInt(app.startH)<10 ? "0" + parseInt(app.startH): app.startH) +":"+(parseInt(app.startM)<10 ? "0" + parseInt(app.startM): app.startM);
    var endH = parseInt(app.startH)+parseInt(app.durationH);
    var endM = parseInt(app.startM) + parseInt(app.durationM);
    if(endM >= 60) {
      endH ++;
      endM -=60;
    }
    var titleRight = (endH < 10 ? "0"+endH:endH)+":"+(endM < 10 ? "0"+endM:endM);
    var titleDuration = titleLeft + " - " + titleRight;
    $('.duration').attr('title', titleDuration);
    var left = "<span>"+titleLeft+"</span>";
    $('.barLeft').empty();
    $('.barLeft').append(left);
    var right = "<span>"+titleRight+"</span>";
    $('.barRight').empty();
    $('.barRight').append(right);
  }