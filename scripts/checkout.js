import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import '../data/cart.js'; 
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";


async function loadPage() {
  await loadProductsFetch()

  await new Promise((resolve) => {
    loadCart(() => {
      resolve('value2');
    });
  })

  renderOrderSummary();
  renderPaymentSummary();

  //return 'value2';
}

loadPage();//.then((value) => {
  //console.log(value);
  //console.log('next step');
//});

/*
//array of promises. 
Promise.all([
  loadProductsFetch(),

  new Promise((resolve) => {
    loadCart(() => {
      resolve('value2');
    });
  })

]).then(() => {
  // console.log(value);

  renderOrderSummary();
  renderPaymentSummary();
});
*/

// new Promise((resolve) => {
//   loadProducts(() => {
//     resolve('value1');
//   });

// }).then((value) => {
//   console.log(value);

//   return new Promise((resolve) => {
//     loadCart(() => {
//       resolve();
//     });
//   });

// }).then(() => {
//   renderOrderSummary();
//   renderPaymentSummary();
// });