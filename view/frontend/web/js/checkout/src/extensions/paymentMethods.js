import { defineAsyncComponent } from 'vue';

export default () => {
  const paymentMethods = {};
  // Look at window.bluefinchCheckout.paymentMethods object to trigger the loading of all payment methods.
  if (window.bluefinchCheckout?.paymentMethods) {
    Object.keys(window.bluefinchCheckout.paymentMethods).forEach((paymentMethod) => {
      paymentMethods[paymentMethod] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.bluefinchCheckout.paymentMethods[paymentMethod]
        )));
    });
  }

  return paymentMethods;
};
