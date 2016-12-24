var layouted = false;
var minLoadingDuration = 2000;
var entranceDuration = 1000;
var autoScrollDuration = 2000;
var startTime = new Date().getTime();
var flyout;
$(document.body).hide();

function initFlyoutColumn(xs, barcolor) {
  var c = $("<div>").attr("class", "col-xs-" + xs);
  var l = $("<h4>").appendTo(c);
  var p = $("<progress>").attr("class", "progress progress-" + barcolor)
    .attr("max", "100").appendTo(c);
  c.data("l", l);
  c.data("p", p);
  return c;
}
function initFlyout() {
  flyout = $("#flyout");
  var status = JSON.parse(flyout.attr("data-status"));
  var container = $("<div>").attr("class", "container").appendTo(flyout);
  var colp = initFlyoutColumn(6, "danger").appendTo(container);
  var cols = initFlyoutColumn(6, "danger").appendTo(container);

  var update = function() {
    var total = status.incomplete + status.complete;
    var selected = $(".checked").length;
    var progress = status.complete * 100 / total;
    var diff = selected * 100 / total;
    colp.data("l").text("Goal: " + Math.round(progress) + "%" 
      + " + " + Math.round(diff) + "%")
    colp.data("p").val(Math.round(progress));

    var leftTime = status.end - new Date().getTime();
    var leftDays = leftTime / (24 * 60 * 60 * 1000);
    var should = status.incomplete / Math.max(1, leftDays);
    cols.data("l").text("Quota: " + selected + " of " + Math.round(should));
    cols.data("p").val(Math.min(100, Math.floor(selected * 100 / should)));
  }
  flyout.data("update", update);
  update();
}

$(function() {
  $("#content").hide();
  $(document.body).show();
  var loaderTicker = setInterval(function() {
    var how = Math.round(Math.random() * 183);
    $("#loadertext").text("LOADING TURRET " + how);
    if (!(layouted && (new Date().getTime() - startTime > minLoadingDuration)))
      return;
    initFlyout();
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
        flyout.data("update")();
      });
    });
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
