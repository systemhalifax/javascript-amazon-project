import { deliveryOptionExist } from "./deliveryOptions.js";

class Cart {
  cartItems; // public property
  #localStorageKey; // private property
  addedMessageTimeouts = {};

  //runs the code 
  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }

  #loadFromStorage () {
    this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey)) || [{
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2,
      deliveryOptionId: '1'
    },
    {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 1,
      deliveryOptionId: '2'
    }];
  }

  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
  }

  addedToCart(productId) {
    const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);

    if (!addedMessage) {
      console.warn(`No element found for product ID ${productId}`);
      return;
    }

    // Clear any existing timeout for this product
    if (this.addedMessageTimeouts[productId]) {
      clearTimeout(this.addedMessageTimeouts[productId]);
    }

    // Add the class to show the message
    addedMessage.classList.add('js-added-to-cart');

    // Set a new timeout to remove the class after 2 seconds
    this.addedMessageTimeouts[productId] = setTimeout(() => {
      addedMessage.classList.remove('js-added-to-cart');
      delete this.addedMessageTimeouts[productId];  // Clean up the dictionary
    }, 2000);
  }

  addToCart(productId, selectorValue = 1) {
    let matchingItem;
    const quantity = selectorValue;
  
    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
  
    if (matchingItem) { 
      matchingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        productId,
        quantity: quantity,
        deliveryOptionId: '1'
      });
    }
  
    this.addedToCart(productId);
  
    this.saveToStorage();
  }

  removeFromCart(productId) {
    const newCart = [];
  
    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId !== productId) {
        newCart.push(cartItem);
      }
    });
  
    this.cartItems = newCart;
  
    this.saveToStorage();
  }

  updateQuantity(productId, newQuantity) {
    let matchingItem;
  
    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
  
    matchingItem.quantity = newQuantity;
  
    this.saveToStorage();
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;
  
    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
  
    if(!matchingItem) {
      console.warn(`No product found in the cart for product ID ${productId}`);
      return;
    } else if(!deliveryOptionExist(deliveryOptionId)) {
      console.warn(`Delivery option does not exist`);
      return;
    }
  
    matchingItem.deliveryOptionId = deliveryOptionId;
  
    this.saveToStorage();
  }
}


const cart = new Cart('cart-oop'); // the value inside this class goes to the constructor's parameter
const businessCart = new Cart('cart-business'); //instance of the class Cart


console.log(cart);
console.log(businessCart);
console.log(businessCart instanceof Cart);



//JSON.parse(localStorage.getItem('cart')); 
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

//JSON.parse(localStorage.getItem('cart')); 

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

// export function calculateCartQuantity (element, page) {
//   let cartQuantity = 0;
//   const cartQuantityElement = element;

//   cart.forEach((cartItem) => {
//     cartQuantity += cartItem.quantity
//   });

//   if (page === 'amazon') {
//     cartQuantityElement.innerHTML = cartQuantity;
//   } else if (page === 'checkout') {
//     cartQuantityElement.innerHTML = `${cartQuantity} items`;
//   }
// }



// export function matchingItem (productId) {
//   let matchingItem;

//   cart.forEach((cartItem) => {
//     if (productId === cartItem.productId) {
//       matchingItem = cartItem;
//     }
//   });

//   return matchingItem;
// }