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

  $('#wallets .popularWallets').animate({'opacity':'1'}, 600);
  $('#header #titleBox h1').animate({'opacity':'1'}, 800, function() {
    $('#header #titleBox h5').animate({'opacity':'1'}, 600)
  });

  /*var timer = 1000;
  var counter = 0;
  var fadeInInterval = setInterval(function() {
    $($('#wallets .popularWallets')[counter]).animate({'opacity':'1'}, timer);
    counter++;

    if (counter > $('#wallets .popularWallets').length) {
      clearInterval(fadeInInterval);
    }
  }, timer * 1 / 2)*/
})

var gallerySlide = 0;
var galleryMax = 6;
function galleryChange(val) {
  gallerySlide += val;

  if (gallerySlide < 0) {
    gallerySlide = galleryMax;
  } else if (gallerySlide > galleryMax) {
    gallerySlide = 0;
  }

  $('#img').stop();
  $('#img2').stop();

  if (val > 0) {
    var imgWidth = $('#img').width();
    $('#img').animate({'left': '-' + imgWidth + 'px'});

    $('#img2').attr('src', 'images/home/gallery' + gallerySlide + '.jpeg');
    $('#img2').animate({'left': '0px'}, function() {
      $('#img').attr('src', 'images/home/gallery' + gallerySlide + '.jpeg');
      $('#img').animate({'left': '0px'}, 0);
      $('#img2').animate({'left': imgWidth + 'px'}, 0);
    });
  } else {
    var imgWidth = $('#img').width();
    $('#img').animate({'left': imgWidth + 'px'});
    $('#img2').animate({'left': '-' + imgWidth + 'px'}, 0);


    $('#img2').attr('src', 'images/home/gallery' + gallerySlide + '.jpeg');
    $('#img2').animate({'left': '0px'}, function() {
      $('#img').attr('src', 'images/home/gallery' + gallerySlide + '.jpeg');
      $('#img').animate({'left': '0px'}, 0);
      $('#img2').animate({'left': imgWidth + 'px'}, 0);
    });
  }
}
