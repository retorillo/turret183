var layouted = false;
var minLoadingDuration = 2000;
var entranceDuration = 1000;
var autoScrollDuration = 2000;
var startTime = new Date().getTime();
$(document.body).hide();
$(function() {
  $("#content").hide();
  $(document.body).show();
  var loaderTicker = setInterval(function() {
    var how = Math.round(Math.random() * 183);
    $("#loadertext").text("LOADING TURRET " + how);
    if (layouted && (new Date().getTime() - startTime > minLoadingDuration)) {
      clearInterval(loaderTicker);
      $("#loader").hide();
      $("#content").show()
        .css('opacity', 0).animate({
        opacity: 1.0,
      }, entranceDuration);
      $('html, body').animate({
        scrollTop: $('.pending').offset().top
          - Math.round($(window).height() / 2),
      }, autoScrollDuration);

      $(".calender").each(function() {
        var e = $(this);
        if (!e.hasClass("incomplete") && !e.hasClass("pending"))
          return;
        e.click(function() {
          var c = "checked";
          var e = $(this);
          if (e.hasClass(c))
            e.removeClass(c);
          else
            e.addClass(c);
        });
      });
    }
  }, 100);

  var icons = ['ak.png', 'am.png', 'ha.png', 'sl.png',
    'sm.png', 'ss.png', 'te.png'];
  var icons_loaded = 0;
  for (var i of icons) {
    var img = new Image();
    img.onload = function() {
      icons_loaded++;
      if (icons_loaded == icons.length)
        layouted = true;
    }
    img.src = "img/" + i;
  }
});
