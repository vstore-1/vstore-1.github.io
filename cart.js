var chips1 = 0;
var chips2 = 0;
var claypot = 0;

function addItem(item) {
    if (item == 'chips1') {
        chips1+=1;
        alert(`Added Onion Rings to cart!`);
    }
    if (item == 'chips2') {
        chips2+=1;
        alert(`Added Salted Egg Chips to cart!`);
    }
    if (item == 'claypot') {
        claypot+=1;
        alert(`Added Claypot to cart!`);
    }
}

function removeItem(item) {
    if (item == 'chips1') {
        if (chips1 > 0) {
            chips1-=1;
            alert(`Removed Onion Rings from cart!`);
        }
        else {
            alert('Product not in cart, cannot remove');
        }
    }
        
    if (item == 'chips2') {
        if (chips2 > 0) {
            chips2-=1;
            alert(`Removed Salted Egg Chips from cart!`);
        }
        else {
            alert('Product not in cart, cannot remove');
        }
    }
    if (item == 'claypot') {
        if (claypot > 0) {
            claypot-=1;
            alert(`Removed Claypot from cart!`);
        }
        else {
            alert('Product not in cart, cannot remove');
        }
    }
}

function buildCartLink() {
    var finalLink = `https://vstore-v2.myshopify.com/cart/`;
    console.log('hit in cart link');
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
    console.log('cartLinkClicked');
    var cartLink = buildCartLink();
    console.log('cartLink', cartLink);
    if (cartLink == 0) {
        alert('Nothing in Cart! Add Something to cart');
    }
    else {
        window.open(cartLink, "_blank");
    }
}