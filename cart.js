var cartlink = 'https://vstore-v2.myshopify.com/cart/add?'

function cartLink(addition) {
    cartlink = cartlink + '&id=' + addition;
    alert(cartlink);
    alert('Added to cart!');
}

function viewCart() {
    window.open(cartlink, '_blank');
}