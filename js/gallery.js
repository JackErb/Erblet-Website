var imageData = [
  {
    'name': 'Serena Williams',
    'description': 'a duct tape portrait of tennis star, <span>serena williams</span>',
    'src': 'images/serenawilliams.jpeg'
  },
  {
    'name': 'Wallets',
    'description': '<span>erblet</span> wallets are made nearly 100% out of duct tape with only 1.4% of the wallet being a film for the id-holder',
    'src': 'images/wallets.jpg'
  },
  {
    'name': 'Aesthetic Wallet',
    'description': 'an <span>erblet wallet</span> is pretty much just a highly functional piece of art. here\'s a design from artist wilson rhan.',
    'src': 'images/walletpic.jpeg'
  },
  {
    'name': 'Great Wave Off Kanagwa',
    'description': 'the <span>great wave off kanagawa</span>, made entirely in duct tape',
    'src': 'images/wave.jpeg'
  },
]

function displayImage(num) {
  $('#mainImage').attr('src',imageData[num].src);
  $('#imageDescription').html(imageData[num].description);
}

displayImage(0);
