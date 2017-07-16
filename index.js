
// Get the modal
var modal = document.getElementById("colorSelector");

// When the user clicks on the 'x' button, close the modal
var closeButton = document.getElementsByClassName("close")[0];

var buyButton = document.getElementById("buyButton");

var base = "red";
var trim = "blue";
var inside = "yellow";

var walletPrice = 16;


var componentToChangeColor = "";

var checkoutButtonWasPressed = false;

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
      break;
    case "trim":
      trim = color;
      break;
    case "inside":
      inside = color;
      break;
  }

  var images = document.getElementsByClassName("front_" + componentToChangeColor);
  for (var i=0; i<images.length; i++) {
    images[i].src="images/" + componentToChangeColor + "_" + color + ".png";
  }

  if (componentToChangeColor == 'base') {
    var images = document.getElementsByClassName("back_base");
    images[0].src = "images/back_" + color + ".png";
  }

  updateBuyButton();
}

function updateBuyButton() {
  $('#buyButton').data('item-custom1-value', base);
  $('#buyButton').data('item-custom2-value', trim);
  $('#buyButton').data('item-custom3-value', inside);


  $('#currentCart').text("Current cart: " + (walletPrice * Snipcart.api.items.all().length) + "$");
}

function openModal(target) {
  modal.style.display = "block";
  closeButton.innerHTML = target.charAt(0).toUpperCase() + target.slice(1) + " Color &times;";
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
  item.description = base + '-' + trim + '-' + inside + ' wallet';

  item.image = drawWallet(0.4,0.4).toDataURL();

  document.getElementById('cartDisplay').insertBefore(drawWallet(0.2,0.2),document.getElementById('currentCart').nextSibling);
});

Snipcart.subscribe('item.removed', function() {
  updateCheckoutCart();
});

function drawWallet(scale) {
  var canvas = document.createElement('canvas');
  canvas.width = "" + Math.round(scale * 720);
  canvas.height = "" + Math.round(scale * 271);

  var ctx = canvas.getContext('2d');

  var img = new Image();

  ctx.scale(scale, scale);

  img.src = 'images/base_' + base + '.png';
  ctx.drawImage(img, 0, 0);

  img.src = 'images/trim_' + trim + '.png';
  ctx.drawImage(img, 0, 0);

  img.src = 'images/inside_' + inside + '.png';
  ctx.drawImage(img, 0, 0);

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
    document.getElementById('cartDisplay').insertBefore(drawWallet(0.2,0.2),document.getElementById('checkoutButton'));
  }
  base = tempBase;
  trim = tempTrim;
  inside = tempInside;
}


Snipcart.subscribe('cart.ready', function() {
  updateBuyButton();

  updateCheckoutCart();

});
