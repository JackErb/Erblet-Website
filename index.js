// Get the modal
var modal = document.getElementById("colorSelector");

// When the user clicks on the 'x' button, close the modal
var closeButton = document.getElementsByClassName("close")[0];

var buyButton = document.getElementById("buyButton");

var base = "red";
var trim = "blue";
var inside = "yellow";


var componentToChangeColor = "";

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

Snipcart.subscribe('cart.opened', function() {
  // Display wallet overlay image
  var customField = $('.snip-customfields')[0];
});

Snipcart.subscribe('cart.closed', function() {
  // Hide wallet overlay image
});

Snipcart.subscribe('item.adding', function(ev, item, items) {
  window.alert(base + '-' + trim + '-' + inside + ' wallet');

  item.description = base + '-' + trim + '-' + inside + ' wallet';
});
