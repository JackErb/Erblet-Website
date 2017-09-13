var imageData = [
  {
    'name': 'Serena Williams',
    'description': 'a duct tape portrait of tennis star, serena williams',
    'src': 'images/serenawilliams.jpeg'
  },
  {
    'name': 'Wallets',
    'description': 'erblet wallets are made nearly 100% out of duct tape with only 1.4% of the wallet being a film for the id-holder',
    'src': 'images/wallets.jpg'
  },
  {
    'name': 'Aesthetic Wallet',
    'description': 'an erblet wallet is pretty much just a highly functional piece of art. here\'s a design from artist wilson rhan.',
    'src': 'images/walletpic.jpeg'
  },
  {
    'name': 'Great Wave Off Kanagwa',
    'description': 'the great wave off kanagawa, made entirely in duct tape',
    'src': 'images/wave.jpeg'
  },
]

function displayImage(num) {
  $('#mainImage').attr('src',imageData[num].src);
  $('#imageDescription').html(imageData[num].description);
}

displayImage(0);
