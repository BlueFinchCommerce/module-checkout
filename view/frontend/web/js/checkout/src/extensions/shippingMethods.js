import { defineAsyncComponent } from 'vue';

export default () => {
  const shippingMethods = {};
  // Look at window.geneCheckout.shippingMethods object to trigger the loading of all shipping methods.
  if (window.geneCheckout?.shippingMethods) {
    Object.keys(window.geneCheckout.shippingMethods).forEach((shippingMethod) => {
      shippingMethods[shippingMethod] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.geneCheckout.shippingMethods[shippingMethod]
        )));
    });
  }

  return shippingMethods;
};
