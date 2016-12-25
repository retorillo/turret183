var layouted = false;
var minLoadingDuration = 2000;
var entranceDuration = 1000;
var autoScrollDuration = 2000;
var startTime = new Date().getTime();
var flyout;
$(document.body).hide();

function initFlyoutContainer() {
  return $("<div>").attr("class", "container");
}
function initFlyoutRow() {
  return $("<div>").attr("class", "row");
}
function initFlyoutColumn(xs) {
  return $("<div>").attr("class", "col-xs-" + xs);
}
function initFlyoutTextColumn(xs) {
  var c = initFlyoutColumn(xs);
  var l = $("<p>").appendTo(c);
  c.data("set", function(text) {
    l.text(text);
  });
  return c;
}
function initFlyoutProgressBarColumn(xs, barcolor) {
  var c = initFlyoutColumn(xs);
  var l = $("<h4>").appendTo(c);
  var p = $("<progress>").attr("class", "progress progress-" + barcolor)
    .attr("max", "100").appendTo(c);
  c.data("set", function(val, text) {
    l.text(text);
    p.val(Math.round(val));
  });
  return c;
}
function initFlyout() {
  flyout = $("#flyout");
  var status = JSON.parse(flyout.attr("data-status"));
  var container = initFlyoutContainer().appendTo(flyout);
  var row = initFlyoutRow().appendTo(container);
  var colp = initFlyoutProgressBarColumn(6, "danger").appendTo(row);
  var cols = initFlyoutProgressBarColumn(6, "danger").appendTo(row);
  var colt = initFlyoutTextColumn(12).appendTo(row);

  var update = function() {
    var total = status.incomplete + status.complete;
    var checked = $(".checked").length;

    var goal = status.complete * 100 / total;
    var diff = checked * 100 / total;
    var goaltext = "Goal: " + Math.round(goal) + "%"
      + " + " + Math.round(diff) + "%";
    colp.data("set")(goal, goaltext);

    var leftTime = status.end - new Date().getTime();
    var leftDays = leftTime / (24 * 60 * 60 * 1000);
    var quota = status.incomplete / Math.max(1, leftDays);
    var quotatext = "Quota: " + checked + " of " + Math.round(quota);
    var quotaval = Math.min(100, Math.floor(checked * 100 / quota));
    cols.data("set")(quotaval, quotatext);

    var futureQuota = (status.incomplete - checked) / Math.max(1, leftDays - 1);

    colt.data("set")(
      "Done: " + (status.complete + checked) + " of " + total
      + " / Future quota: " + Math.round(futureQuota * 100) / 100 + " per day");
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
