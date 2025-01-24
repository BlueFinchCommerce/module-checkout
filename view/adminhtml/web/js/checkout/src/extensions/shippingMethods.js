import { defineAsyncComponent } from 'vue';

export default () => {
  const shippingMethods = {};
  // Look at window.bluefinchCheckout.shippingMethods object to trigger the loading of all payment methods.
  if (window.bluefinchCheckout?.shippingMethods) {
    Object.keys(window.bluefinchCheckout.shippingMethods).forEach((shippingMethod) => {
      shippingMethods[shippingMethod] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.bluefinchCheckout.shippingMethods[shippingMethod]
        )));
    });
  }

  return shippingMethods;
};
