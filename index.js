
// When the user clicks on the 'x' button, close the modal
var closeButton = document.getElementById("close");

var buyButton = document.getElementById("buyButton");

var base = "dark-blue";
var trim = "electric-blue";
var inside = "icy-blue";

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
  'white' : '#ffffff',
  'dove-grey' : '#c3c7ca',
  'fluorescent-citrus' : '#bfd979',
  'olive' : '#494835',
  'terracota' : '#bf5124',
  'yellow' : '#EFC854'
  //Bronze
  //Silver
  //Gold
}



/* Cart stuff */

var localCart = [];

function addToCart(b, t, i) {
  localCart.push({
    'base': b,
    'trim': t,
    'inside': i
  });
}

$(buyButton).click(function () {
  addToCart(base, trim, inside);
  updateCheckoutCart();

  syncCartToSnipcart();
});

function syncCart() {
  localCart = [];

  var wallets = Snipcart.api.items.all();
  console.log(wallets);

  for (var j = 0; j < wallets.length; j++) {
    var wallet = wallets[j];

    var b = wallet.customFields[0]['value'];
    var t = wallet.customFields[1]['value'];
    var i = wallet.customFields[2]['value'];

    addToCart(b, t, i);
  }

  updateCheckoutCart();
}








/* Modal stuff */

var colorsContainer = document.getElementById("colorsContainer");

// Create all color icons
for (var key in colorHexCodes) {
  if (colorHexCodes.hasOwnProperty(key)) {
    var colorDiv = document.createElement("div");
    colorDiv.id = key;
    colorDiv.className += 'color';
    colorDiv.style.backgroundColor = colorHexCodes[key];

    $('#colors').append(colorDiv);
    $('#' + key).click(function(event) {
      changeColor(event.target.id)
      $('html,body').animate({
            scrollTop: $('#header').offset().top},
            'smooth');
    });
  }
}

// When the user presses escape, close the modal
document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
        closeModal();
    }
};

function openModal(target) {
  colorsContainer.style.display = "block";
  closeButton.innerHTML = target + " color &times;";
  componentToChangeColor = target;

  var offset = $('#close').offset().top - $(window).scrollTop();

  $('html,body').animate({
        scrollTop: offset},
        'slow');
}

function closeModal() {
  colorsContainer.style.display = "none";
}

// Switch the color of the wallet
function changeColor(color) {
  switch (componentToChangeColor) {
    case "base":
      base = color;
      break;
    case "trim":
      trim = color;
      break;
    case "inside":
      inside = color;
      break;
  }

  drawWallet(1.0, base, trim, inside, $('#frontWalletDisplay')[0]);
  drawBackWallet($('#backWalletDisplay')[0]);
}







/* Snipcart stuff */

Snipcart.execute('config', 'show_continue_shopping', true);

Snipcart.subscribe('cart.ready', function() {
  changeColor(base);

  updateCheckoutCart();
  Snipcart.api.items.clear();
});

Snipcart.subscribe('cart.opened', function (item) {
  if (!checkoutButtonWasPressed) {
    Snipcart.api.modal.close();
    return;
  }

  checkoutButtonWasPressed = false;
});

Snipcart.subscribe('cart.closed', function() {
  syncCart();
  updateCheckoutCart();
});

function checkout() {
  checkoutButtonWasPressed = true;
  Snipcart.api.items.clear().then(function() {
    Snipcart.api.items.add(localCart.map(function(wallet) {
        return {
          "id": "WALLET",
          "name": "wallet",
          "description": wallet.base.replace('-', ' ') + ' - ' + wallet.trim.replace('-', ' ') + ' - ' + wallet.inside.replace('-', ' ') + ' wallet.',
          "url": "/",
          image: drawWallet(0.4, wallet.base, wallet.trim, wallet.inside).toDataURL(),
          "price": 16.0,
          "quantity": 1,
          "stackable": false,
          "customFields": [{
            'name': "base",
            'value': wallet.base
          },
          {
            'name': "trim",
            'value': wallet.trim
          },
          {
            'name': "inside",
            'value': wallet.inside
          }]
        }
      }));
    }).then(function() {
      Snipcart.api.modal.show();
    });
}

$('#checkoutButton').click(checkout);







/* Drawing wallet */

function drawWallet(scale, base, trim, inside, canvas) {
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

function addWalletIconToCart(item, number) {
  var canvas = drawWallet(0.2, base, trim, inside);
  canvas.style.float = 'left';
  var container = document.createElement('div');
  container.className = 'cartItem';

  var xButton = document.createElement('p');
  xButton.innerHTML = '&#10006; &nbsp;&nbsp;';
  xButton.style.display = 'inline-block';
  xButton.style.float = 'left';
  xButton.id = "" + number;
  xButton.className = "xButton";


  var removeWallet = function(event) {
    var number = event.target.id;

    localCart.splice(number, 1);
    updateCheckoutCart();
  }

  // Remove wallet from cart
  $(xButton).click(removeWallet)

  // If the screen is phone-sized, allow the wallet to be removed by touching the container
  if (window.matchMedia('(min-width: 480px)').matches) {
    $(container).click(removeWallet);
  }

  container.appendChild(xButton);
  container.appendChild(canvas);

  $('#walletsCartDisplay').prepend(container);
}

function updateCheckoutCart() {
  $('#cartDisplay .cartItem').remove();

  var tempBase = base;
  var tempTrim = trim;
  var tempInside = inside;

  for (var i = 0; i < localCart.length; i++){
    var wallet = localCart[i];

    base = wallet.base;
    trim = wallet.trim;
    inside = wallet.inside;
    addWalletIconToCart(wallet, i);
  }

  base = tempBase;
  trim = tempTrim;
  inside = tempInside;
}
