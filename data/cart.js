export let cart =  JSON.parse(localStorage.getItem('cart')) || [{
  productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
  quantity: 2,
},
{
  productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
  quantity: 1,
}]; //JSON.parse(localStorage.getItem('cart')); 

// if (!cart) {
//   cart = [{
//     productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
//     quantity: 2,
//   },
//   {
//     productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
//     quantity: 1,
//   }];
// }

export function saveToStorage () {
  localStorage.setItem('cart', JSON.stringify(cart));
}

let addedMessageTimeouts = {};

function addedToCart (productId) {
  const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);

  if (!addedMessage) {
    console.warn(`No element found for product ID ${productId}`);
    return;
  }

  // Clear any existing timeout for this product
  if (addedMessageTimeouts[productId]) {
    clearTimeout(addedMessageTimeouts[productId]);
  }

  // Add the class to show the message
  addedMessage.classList.add('js-added-to-cart');

  // Set a new timeout to remove the class after 2 seconds
  addedMessageTimeouts[productId] = setTimeout(() => {
    addedMessage.classList.remove('js-added-to-cart');
    delete addedMessageTimeouts[productId];  // Clean up the dictionary
  }, 2000);

}



export function addToCart (productId, quantitySelector) {
  let matchingCartItem = matchingItem(productId);
  const quantity = Number(quantitySelector.value);

  // console.log(matchingCartItem);

  // cart.forEach((cartItem) => {
  //   if (productId === cartItem.productId) {
  //     matchingItem = cartItem;
  //   }
  // });

  if (matchingCartItem) { 
    matchingCartItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
    });
  }

  addedToCart(productId);

  saveToStorage();
}

export function removeFromCart (productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;

  saveToStorage();
}

export function calculateCartQuantity (element, page) {
  let cartQuantity = 0;
  const cartQuantityElement = element;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity
  });

  if (page === 'amazon') {
    cartQuantityElement.innerHTML = cartQuantity;
  } else if (page === 'checkout') {
    cartQuantityElement.innerHTML = `${cartQuantity} items`;
  }
}

export function matchingItem (productId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  return matchingItem;
}