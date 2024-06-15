import { cart, removeFromCart, calculateCartQuantity, updateQuantity, updateDeliveryOption} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary () {


  let cartSummaryHTML = '';


  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    cartSummaryHTML += `
    
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link js-update-link js-update-link-${matchingProduct.id} link-primary" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="quantity-input js-quantity-input-${matchingProduct.id}" type="number">
            <span class="save-quantity-link js-save-link js-save-quantity-${matchingProduct.id} link-primary" data-product-id="${matchingProduct.id}">Save</span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
    
    `;
  });

  function deliveryOptionsHTML (matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
      const dateString = deliveryDate.format('dddd, MMMM D');
      const priceString = deliveryOption.priceCents
      === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `

      <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} - Shipping
          </div>
        </div>
      </div>

      `;
    });

    return html;
  }


  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );

        container.remove(); //remove from the page  
        calculateCartQuantity(document.querySelector(
          '.js-checkout-header-middle-section'), 'checkout');

        renderPaymentSummary();
      }); 
    });

  calculateCartQuantity(document.querySelector(
    '.js-checkout-header-middle-section'), 'checkout');

  document.querySelectorAll('.js-update-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const {productId} = link.dataset;

        const container = document.querySelector(`.js-cart-item-container-${productId}`);

        const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);

        const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);

        const quantity = quantityLabel.innerHTML;

        container.classList.add('is-editing-quantity');

        quantityInput.value = quantity;
      });
    });


  document.querySelectorAll('.js-save-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const {productId} = link.dataset;

        const container = document.querySelector(`.js-cart-item-container-${productId}`);

        container.classList.remove('is-editing-quantity');

        const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);

        const newQuantity = Number(quantityInput.value);

        if (newQuantity < 0 || newQuantity >= 1000) {
          alert('Quantity must be at least 0 and less than 1000');
          return;
        } else if (!newQuantity) {
            removeFromCart(productId);

            const container = document.querySelector(
              `.js-cart-item-container-${productId}`
            );
      
            container.remove(); //remove from the page  
            calculateCartQuantity(document.querySelector(
              '.js-checkout-header-middle-section'), 'checkout');
            return;
        }

        updateQuantity(productId, newQuantity);

        const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);

        quantityLabel.innerHTML = newQuantity;

        calculateCartQuantity(document.querySelector(
          '.js-checkout-header-middle-section'), 'checkout');
      }); 
    });

    document.querySelectorAll('.js-delivery-option')
      .forEach((element) => {
        const {productId, deliveryOptionId} = element.dataset;
        element.addEventListener('click', () => {
          updateDeliveryOption(productId, deliveryOptionId);
          renderOrderSummary(); //recursion
          renderPaymentSummary();
        });
      });
    }

  // document.querySelectorAll('.js-update-link')
  // .forEach((link) => {
  //   const productId = link.dataset.productId;
  //   link.addEventListener('click', () => { 
      //set the save link and quantity input display to initial and set the display for the update link to none
  //     const saveQuantityLink = document.querySelector(`.js-save-quantity-${productId}`);
  //     const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
  //     const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
  //     const quantity = quantityLabel.innerHTML

  //     saveQuantityLink.classList.add('save-quantity-link--modifier');
  //     quantityInput.classList.add('quantity-input--modifier');
  //     quantityLabel.innerHTML = '';
  //     link.classList.add('update-quantity-link--modifier');

  //     quantityInput.value = quantity;
  //   });
  // });


// document.querySelectorAll('.js-save-quantity-link')
//   .forEach((link) => {
//     const {productId} = link.dataset;

//     link.addEventListener('click', () => {
      //set the update link display to initial and set the display for the save link and quantity input to none and get the input value and 
      // const updateLink = document.querySelector(`.js-update-link-${productId}`);
      // const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
      // const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
      // const quantity = Number(quantityInput.value);

      // if (quantity < 0) {
      //   alert('Not a valid quantity');
      //   return;
      // } else if (!quantity) {
      //   removeFromCart(productId);

      //   const container = document.querySelector(
      //     `.js-cart-item-container-${productId}`
      //   );
  
      //   container.remove(); //remove from the page  
  //       calculateCartQuantity(document.querySelector(
  //         '.js-checkout-header-middle-section'), 'checkout');
  //       return;
  //     }

  //     updateLink.classList.remove('update-quantity-link--modifier');
  //     quantityInput.classList.remove('quantity-input--modifier');
  //     link.classList.remove('save-quantity-link--modifier');

  //     let matchingCartItem = matchingItem(productId);

  //     if (matchingCartItem) {
  //       matchingCartItem.quantity = quantity;
  //     }

  //     quantityLabel.innerHTML = matchingCartItem.quantity;


  //     calculateCartQuantity(document.querySelector(
  //       '.js-checkout-header-middle-section'), 'checkout');

  //     saveToStorage();
  //   });
  // });



