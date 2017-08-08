
// When the user clicks on the 'x' button, close the modal
var closeButton = document.getElementById("close");

var buyButton = document.getElementById("buyButton");

var base = "peach";
var trim = "merlot";
var inside = "beige";

var componentToChangeColor = "base";


var colorHexCodes = {
  'dark-blue' : '#11198B',
  'teal' : '#18a2ac',
  'electric-blue' : '#1eb3e1',
  'icy-blue' : '#79ceea',
  'purple' : '#7D319E',
  'lilac' : '#c6b6e0',
  'olive' : '#0F3714',
  'green' : '#0f7b42',
  'sage' : '#91c9a2',
  'neon-green' : '#27d63d',
  'fluorescent-citrus' : '#b7f22f',
  'merlot' : '#7c3141',
  'red' : '#a5122a',
  'fuchsia' : '#de1f83',
  'pink' : '#FA37D6',
  'baby-pink' : '#f0b9e0',
  'terracota' : '#bf5124',
  'neon-orange' : '#fe6627',
  'peach' : '#fca489',
  'yellow' : '#f4f418',
  'black' : '#0f181f',
  'brown' : '#6f372c',
  'beige' : '#f0d7c9',
  'grey' : '#6B6B6C',
  'dove-grey' : '#C1BEC0',
  'white' : '#ffffff'

  //Bronze
  //Silver
  //Gold
}

function componentDisplayName(name) {
  switch(name) {
    case 'base':
      return 'primary';
    case 'trim':
      return 'secondary';
    case 'inside':
      return 'tertiary';
    default:
      return '';
  }
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
  componentToChangeColor = target;

  closeButton.innerHTML = componentDisplayName(componentToChangeColor) + " color &times;";

  var offset = $('#colors').offset().top - $(window).scrollTop();

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

Snipcart.subscribe('cart.closed', function() {
  syncCart();
  updateCheckoutCart();
});

function checkout() {
  Snipcart.api.items.clear().then(function() {
    Snipcart.api.items.add(localCart.map(function(wallet) {
        return {
          "id": "WALLET",
          "name": "wallet",
          "description": wallet.base.replace('-', ' ') + ' - ' + wallet.trim.replace('-', ' ') + ' - ' + wallet.inside.replace('-', ' ') + ' wallet.',
          "url": "http://www.erblet.com/",
          "image": drawWallet(0.4, wallet.base, wallet.trim, wallet.inside).toDataURL(),
          "price": "16",
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
  ctx.fillRect(15,38,329,19);
  ctx.fillRect(15,68,329,19);
  ctx.fillRect(15,98,329,19);
  ctx.fillRect(369,38,329,19);

  if (trim == base) {
    ctx.strokeRect(15,38,329,19);
    ctx.strokeRect(15,68,329,19);
    ctx.strokeRect(15,98,329,19);
  }

  if (trim == base || inside == trim) {
    ctx.strokeRect(369,38,329,19);
  }


  //Draw inside
  ctx.fillStyle = colorHexCodes[inside];
  ctx.fillRect(369,57,329,178);

  if (inside == trim || inside == base) {
    ctx.strokeRect(369,57,329,178);
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
