
// Get the modal
var modal = document.getElementById("colorSelector");

// When the user clicks on the 'x' button, close the modal
var closeButton = document.getElementsByClassName("close")[0];

var buyButton = document.getElementById("buyButton");

var base = "red";
var trim = "blue";
var inside = "yellow";

var walletPrice = 16;

var componentToChangeColor = "base";

var checkoutButtonWasPressed = false;

var colorHexCodes = {
  'red'   : '#ED6A64',
  'blue'  : '#5E99C5',
  'yellow': '#EEBD7E'
}

document.getElementById("blueColor").addEventListener("click", function() {
  changeColor("blue")
}, false);

document.getElementById("redColor").addEventListener("click", function() {
  changeColor("red")
}, false);

document.getElementById("yellowColor").addEventListener("click", function() {
  changeColor("yellow")
}, false);

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
      closeModal();
  }
}

document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
        closeModal();
    }
};

function changeColor(color) {
  switch (componentToChangeColor) {
    case "base":
      base = color;
      //var color = (colorHexCodes[base] & 0xfefefe) >> 1;
      //$('.walletDisplay').css('boxShadow','3px 3px 1px #' + color);
      break;
    case "trim":
      trim = color;
      break;
    case "inside":
      inside = color;
      break;
  }

  drawWallet(1.0,$('#frontWalletDisplay')[0]);
  drawBackWallet($('#backWalletDisplay')[0]);


  updateBuyButton();
}

function updateBuyButton() {
  $('#buyButton').data('item-custom1-value', base);
  $('#buyButton').data('item-custom2-value', trim);
  $('#buyButton').data('item-custom3-value', inside);
}

function openModal(target) {
  modal.style.display = "block";
  closeButton.innerHTML = target + " color &times;";
  componentToChangeColor = target;
}

function closeModal() {
  modal.style.display = "none";
}

function trimClick() {
  openModal("trim");
}

function baseClick() {
  openModal("base");
}

function insideClick() {
  openModal("inside");
}

Snipcart.execute('config', 'show_continue_shopping', true);

Snipcart.subscribe('item.adding', function(ev, item, items) {
  item.description = base + '-' + trim + '-' + inside;

  item.image = drawWallet(0.4).toDataURL();

  $('#walletsCartDisplay').prepend(drawWallet(0.2));

});

Snipcart.subscribe('item.removed', function() {
  updateCheckoutCart();
});

function drawWallet(scale, canvas) {
  if (canvas == null) {
    canvas = document.createElement('canvas');
    canvas.width = "" + Math.round(scale * 720);
    canvas.height = "" + Math.round(scale * 271);
  }

  var ctx = canvas.getContext('2d');

  ctx.scale(scale, scale);

  ctx.strokeStyle = "#D1D1D1";
  ctx.lineWidth = 0.75;

  // Draw base
  ctx.fillStyle = colorHexCodes[base];
  ctx.fillRect(0,0,720,271);

  // Draw trim
  ctx.fillStyle = colorHexCodes[trim];
  ctx.fillRect(15,38,329,22);
  ctx.fillRect(15,68,329,22);
  ctx.fillRect(15,98,329,22);
  ctx.fillRect(369,33,329,16);

  if (trim == base) {
    ctx.strokeRect(15,38,329,22);
    ctx.strokeRect(15,68,329,22);
    ctx.strokeRect(15,98,329,22);
  }

  if (trim == base || inside == trim) {
    ctx.strokeRect(370,33,327,16);
  }


  //Draw inside
  ctx.fillStyle = colorHexCodes[inside];
  ctx.fillRect(369,49,329,178);

  if (inside == trim || inside == base) {
    ctx.strokeRect(370,49,327,178);
  }

  return canvas;
}

function drawBackWallet(canvas) {
  var ctx = canvas.getContext('2d');

  // Draw base
  ctx.fillStyle = colorHexCodes[base];
  ctx.fillRect(0,0,720,271);

  return canvas;
}

function checkout() {
  checkoutButtonWasPressed = true;
  Snipcart.api.modal.show();
}

document.getElementById('checkoutButton').onclick = checkout;


Snipcart.subscribe('cart.opened', function (item) {
  if (!checkoutButtonWasPressed) {
    Snipcart.api.modal.close();
    return;
  }

  checkoutButtonWasPressed = false;
});

function updateCheckoutCart() {
  $('#cartDisplay canvas').remove();

  var tempBase = base;
  var tempTrim = trim;
  var tempInside = inside;

  var items = Snipcart.api.items.all();
  for (var i = 0; i < items.length; i++){
    var item = items[i];

    base = item.customFields[0]['value'];
    trim = item.customFields[1]['value'];
    inside = item.customFields[2]['value'];
    $('#walletsCartDisplay').prepend(drawWallet(0.2));
  }

  base = tempBase;
  trim = tempTrim;
  inside = tempInside;
}


Snipcart.subscribe('cart.ready', function() {
  changeColor('red');
  updateBuyButton();

  updateCheckoutCart();

});
