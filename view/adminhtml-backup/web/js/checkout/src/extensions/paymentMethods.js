import { defineAsyncComponent } from 'vue';

export default () => {
  const paymentMethods = {};
  // Look at window.geneCheckout.paymentMethods object to trigger the loading of all payment methods.
  if (window.geneCheckout?.paymentMethods) {
    Object.keys(window.geneCheckout.paymentMethods).forEach((paymentMethod) => {
      paymentMethods[paymentMethod] = defineAsyncComponent(() => (
        import(window.geneCheckout.paymentMethods[paymentMethod])));
    });
  }

  return paymentMethods;
};
