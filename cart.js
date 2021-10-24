var chips1 = 0;
var chip2 = 0;
var claypot = 0;

function addItem(item) {
    if (item == 'chips1') {
        chips1+=1;
        alert('Added Onion Rings to cart!');
    }
    if (item == 'chips2') {
        chips2+=1;
        alert('Added Salted Egg Chips to cart!');
    }
    if (item == 'claypot') {
        claypot+=1;
        alert('Added Claypot to cart!');
    }
}

function removeItem(item) {
    if (item == 'chips1') {
        if (chips1 >= 0) {
            chips1-=1;
        }
        else {
            alert('Product not in cart, cannot remove');
        }
    }
        
    if (item == 'chips2') {
        if (chips2 >= 0) {
            chips2-=1;
        }
        else {
            alert('Product not in cart, cannot remove');
        }
    }
    if (item == 'claypot') {
        if (claypot >= 0) {
            claypot-=1;
        }
        else {
            alert('Product not in cart, cannot remove');
        }
    }
}
//https://vstore-v2.myshopify.com/cart/41652085195000:2,41652107935992:2,41652134478072:1
function buildCartLink() {
    var finalLink = `https://vstore-v2.myshopify.com/cart/`;
    if (chips1 == 0 && chips2 == 0 && claypot == 0) {
        return 0;
    }
    if (chips1 > 0) {
        finalLink = `${finalLink}41652107935992:${chips1}`;
    }
    if (chips2 > 0) {
        if (chips1 > 0) {
            finalLink = `${finalLink},`;
        }
        finalLink = `${finalLink}41652085195000:${chips2}`;
    }
    if (claypot > 0) {
        if (chips1 > 0 || chips2 > 0) {
            finalLink = `${finalLink},`;
        }
        finalLink = `${finalLink}41652134478072:${claypot}`;
    }
    return finalLink;
}

function viewCart() {
    console.log('cartLinkClicked', cartLink);
    var cartLink = buildCartLink();
    console.log('cartLink', cartLink);
    if (cartLink == 0) {
        alert('Nothing in Cart! Add Something to cart');
    }
    else {
        alert(`Cart link: ${cartLink}`);
    }
    //window.open(cartlink, '_blank');
}