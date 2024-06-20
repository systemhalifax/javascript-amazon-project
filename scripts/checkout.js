import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import '../data/cart.js'; //runs all the code inside a file without importing anything
import '../data/backend-practice.js';

renderOrderSummary();
renderPaymentSummary();