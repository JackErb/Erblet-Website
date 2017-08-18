
// When the user clicks on the 'x' button, close the modal
var closeButton = document.getElementById("close");

var buyButton = document.getElementById("buyButton");

var base = "peach";
var trim = "merlot";
var inside = "beige";

function isMobile() {
  return window.matchMedia('(max-width:480px)').matches;
}


var colorHexCodes = {
  'dark-blue' : '#2E1E87',
  'teal' : '#18a2ac',
  'electric-blue' : '#1eb3e1',
  'dark-blue' : '#11198B',
  'teal' : '#18A2AC',
  'electric-blue' : '#1EB3E1',
  'icy-blue' : '#79ceea',
  'purple' : '#7D319E',
  'lilac' : '#C6B6E0',
  'olive' : '#0F3714',
  'green' : '#0F7B42',
  'sage' : '#91c9a2',
  'neon-green' : '#27d63d',
  'fluorescent-citrus' : '#b7f22f',
  'merlot' : '#7c3141',
  'red' : '#a5122a',
  'fuchsia' : '#DD4390',
  'pink' : '#FC5CD3',
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
  'white' : '#ffffff',
  'silver' : {
      'presets': [2,0,648,244],
      'colors': [
        [0, 'rgba(214, 214, 214, 1.000)'],
        [0.346, 'rgba(114, 112, 112, 1.000)'],
        [0.451, 'rgba(150, 139, 139, 1.000)'],
        [0.569, 'rgba(188, 184, 184, 1.000)'],
        [0.801, 'rgba(147, 141, 141, 1.000)'],
        [1.000, 'rgba(255, 255, 255, 1.000)']
      ],
      'helpColor': '#bcb8b8'
  },
  'gold': {
      'presets': [0,2.372,648,244],
      'colors': [
        [0.000, 'rgba(193,193,11,1)'],
        [0.240, 'rgba(248,249,159,1)'],
        [0.640, 'rgba(217,159,0,1)'],
        [1.000, 'rgba(244,242,183,1)']
      ],
      'helpColor': '#f8f99f'
  }

  //Bronze
  //Silver
  //Gold
}

var componentToChangeColor = "base";
changeColor(base);

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




/* Help stuff */

var helpDisplayIsDown = false;

$("#helpDisplay").animate({width:'hide'},0);
function displayHelp() {
  $("#helpDisplay").animate({width:'toggle'});
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

  for (var j = 0; j < wallets.length; j++) {
    var wallet = wallets[j];

    var b = wallet.customFields[0]['value'];
    var t = wallet.customFields[1]['value'];
    var i = wallet.customFields[2]['value'];

    addToCart(b, t, i);
  }

  updateCheckoutCart();
}





/* Color selection stuff */

var colorsContainer = document.getElementById("colorsContainer");


// Create all color icons
for (var key in colorHexCodes) {
  if (colorHexCodes.hasOwnProperty(key)) {
    var colorDiv = document.createElement("div");
    colorDiv.id = key;
    colorDiv.className += 'color';
    if (key == 'gold' || key == 'silver') {
      // Gradient color -- use an image
      colorDiv.style.backgroundImage = 'url(images/' + key + '.png)';
    } else {
      colorDiv.style.backgroundColor = colorHexCodes[key];
    }

    $('#colors').append(colorDiv);
    $(colorDiv).click(function(event) {
      changeColor(event.target.id);
    })
  }
}

$(colorsContainer).height($(colorsContainer).height());


// When the user presses escape, close the color selector
document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
        closeModal();
    }
};

function openModal(target) {
  colorsContainer.style.visibility = "visible";
  $(colorsContainer).slideDown('smooth');
  componentToChangeColor = target;

  closeButton.innerHTML = componentDisplayName(componentToChangeColor) + " color &times;";

  $('#helpDisplay').animate({width:'hide'});
}

function closeModal() {
  $('#colorsContainer').slideUp('smooth');
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

  var lighten = 40;
  var darken = -30;
  switch (inside) {
    case 'fluorescent-citrus':
      lighten = 40;
      darken = -40;
      break;
    case 'yellow':
      darken = -50;
      break;
    case 'white':
      darken = -60;
      break;
  }
  var color;
  var isGradient = inside == 'silver' || inside == 'gold';
  if (isGradient) {
    color = colorHexCodes[inside]['helpColor'];
  } else {
    color = colorHexCodes[inside];
  }
  $('#helpContent').css('background-color',adjustColor(color,lighten));
  $('#helpContent').css('color',adjustColor(color,darken));

  drawWallet(1.0, base, trim, inside, $('#frontWalletDisplay')[0]);
  drawBackWallet($('#backWalletDisplay')[0]);
}








/* Snipcart stuff */

Snipcart.execute('config', 'show_continue_shopping', true);

Snipcart.subscribe('cart.ready', function() {
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
          "description": wallet.base.replace('-', ' ') + ' - ' + wallet.trim.replace('-', ' ') + ' - ' + wallet.inside.replace('-', ' '),
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






function getFill(ctx, color) {
  var isGradient = color == 'gold' || color == 'silver';
  if (isGradient) {
    var info = colorHexCodes[color]

    var presets = info['presets']
    var grd = ctx.createLinearGradient(presets[0],presets[1],presets[2],presets[3]);

    var colors = info['colors'];
    console.log(colors);
    for (var i = 0; i < colors.length; i++) {
      grd.addColorStop(colors[i][0], colors[i][1]);
    }
    return grd;
  }
  return colorHexCodes[color];
}

/* Drawing wallet */

function drawWallet(scale, base, trim, inside, canvas) {
  if (canvas == null) {
    canvas = document.createElement('canvas');
    canvas.width = "" + Math.round(scale * 720);
    canvas.height = "" + Math.round(scale * 271);
  }

  var canvasScale = 0.9;


  var ctx = canvas.getContext('2d');

  ctx.scale(scale, scale);

  ctx.strokeStyle = "#D1D1D1";
  ctx.lineWidth = 0.75;

  // Draw base
  ctx.fillStyle = getFill(ctx, base);
  ctx.fillRect(0,0,720 * canvasScale,271 * canvasScale);

  // Draw trim
  ctx.fillStyle = getFill(ctx, trim);

  ctx.fillRect(15*canvasScale,38*canvasScale,329*canvasScale,19*canvasScale);
  ctx.fillRect(15*canvasScale,68*canvasScale,329*canvasScale,19*canvasScale);
  ctx.fillRect(15*canvasScale,98*canvasScale,329*canvasScale,19*canvasScale);
  ctx.fillRect(369*canvasScale,38*canvasScale,329*canvasScale,19*canvasScale);

  if (trim == base) {
    ctx.strokeRect(15*canvasScale,38*canvasScale,329*canvasScale,19*canvasScale);
    ctx.strokeRect(15*canvasScale,68*canvasScale,329*canvasScale,19*canvasScale);
    ctx.strokeRect(15*canvasScale,98*canvasScale,329*canvasScale,19*canvasScale);
  }

  if (trim == base || inside == trim) {
    ctx.strokeRect(369*canvasScale,38*canvasScale,329*canvasScale,19*canvasScale);
  }


  //Draw inside
  ctx.fillStyle = getFill(ctx, inside);
  ctx.fillRect(369*canvasScale,57*canvasScale,329*canvasScale,178*canvasScale);

  if (inside == trim || inside == base) {
    ctx.strokeRect(369*canvasScale,57*canvasScale,329*canvasScale,178*canvasScale);
  }

  return canvas;
}

function drawBackWallet(canvas) {
  var ctx = canvas.getContext('2d');

  // Draw base
  console.log(base)
  ctx.fillStyle = getFill(ctx, base);
  ctx.fillRect(0,0,648,244);
}

function addWalletIconToCart(item, number) {
  window.alert(isMobile());
  var walletScale = isMobile() ? 0.25 : 0.2;
  var canvas = drawWallet(walletScale, base, trim, inside);
  canvas.style.float = 'left';
  var container = document.createElement('div');
  container.className = 'cartItem';
  container.visibility = 'hidden';

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
  if (isMobile()) {
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




function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}


function adjustColor(col, amt) {

    var usePound = false;

    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col,16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if  (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if  (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    var color = (g | (b << 8) | (r << 16)).toString(16);

    return '#' + pad(color, 6, 0);
}
