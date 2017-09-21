function showInfo(product) {
  $('#' + product + 'Info').animate({'height': 'toggle',
                                     'padding-top': 'toggle',
                                     'padding-bottom': 'toggle'});



  var arrow = $('#' + product + ' .learnMore .arrow');
  if (arrow.getRotateAngle() > 45) {
    arrow.rotate({
      duration: 600,
      angle: 90,
      animateTo: 0
      });
  } else {
    arrow.rotate({
      duration: 600,
      angle: 0,
      animateTo: 90
      });
  }
}


$(document).ready(function() {
  $('#yakInfo').hide();
})
