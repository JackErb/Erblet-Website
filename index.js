
// Get the modal
var modal = document.getElementById("colorSelector");

// When the user clicks on the 'x' button, close the modal
var closeButton = document.getElementsByClassName("close")[0];

var buyButton = document.getElementById("buyButton");

var base = "sage";
var trim = "neon-green";
var inside = "green";

var walletPrice = 16;

var componentToChangeColor = "base";

var checkoutButtonWasPressed = false;

var colorHexCodes = {
  'electric-blue' : '#1eb3e1',
  'teal' : '#18a2ac',
  'icy-blue' : '#79ceea',
  'dark-blue' : '#102c52',
  'grey' : '#51545b',
  'green' : '#0f7b42',
  'neon-green' : '#27d63d',
  'sage' : '#91c9a2',
  'peach' : '#fca489',
  'neon-orange' : '#fe6627',
  'pink' : '#dbe1d3',
  'fuchsia' : '#de1f83',
  'red' : '#a5122a',
  'baby-pink' : '#f0b9e0',
  'lilac' : '#c6b6e0',
  'purple' : '#532b74',
  'merlot' : '#7c3141',
  'beige' : '#f0d7c9',
  'brown' : '#6f372c',
  'black' : '#0f181f',
  'white' : '#f7f7f7',
  'dove-grey' : '#c3c7ca',
  'fluorescent citrus' : '#bfd979',
  'olive' : '#494835',
  'terracota' : '#bf5124',
  'yellow' : '#EFC854'
  //Bronze
  //Silver
  //Gold
}

// Create all color icons
for (var key in colorHexCodes) {
  if (colorHexCodes.hasOwnProperty(key)) {
    var colorDiv = document.createElement("div");
    colorDiv.id = key;
    colorDiv.className += 'color';
    colorDiv.style.backgroundColor = colorHexCodes[key];

    $('#colors').append(colorDiv);
    document.getElementById(key).onclick = function(event) {
      changeColor(event.srcElement.id)
    }
  }
}

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
  item.description = base.replace('-',' ') + '-' + trim.replace('-', ' ')+ '-' + inside.replace('-', ' ');

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
  changeColor(base);
  updateBuyButton();

  updateCheckoutCart();

});
