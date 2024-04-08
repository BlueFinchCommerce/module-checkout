// For UI designer only
import getDummyFullCart from '@/helpers/dummyContent/getDummyFullCart';

export default (carrierCode, methodCode) => {
  const cart = getDummyFullCart()[0];

  // Update the selected shipping method
  const selectedShippingMethod = cart.shipping_addresses[0].available_shipping_methods.find(
    (method) => method.carrier_code === carrierCode && method.method_code === methodCode,
  );

  cart.shipping_addresses[0].selected_shipping_method = selectedShippingMethod;

  // Recalculate subtotal including tax based on items
  let subtotalIncludingTax = cart.items.reduce((total, item) => total
  + item.product.price_range.minimum_price.final_price.value * item.quantity, 0);

  // Apply discount
  const discount = cart.prices.discounts.reduce((total, discountAmount) => total + discountAmount.amount.value, 0);

  subtotalIncludingTax -= discount;

  // Calculate shipping amount
  const shippingAmount = selectedShippingMethod ? selectedShippingMethod.amount.value : 0;

  // Update grand total
  cart.prices.subtotal_including_tax.value = subtotalIncludingTax;
  cart.prices.grand_total.value = subtotalIncludingTax + shippingAmount;

  return cart;
};
