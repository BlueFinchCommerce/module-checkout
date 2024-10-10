import { defineAsyncComponent } from 'vue';

export default () => {
  const paymentMethodsPrimary = {};
  // Look at window.geneCheckout.paymentMethodsPrimary object to trigger the loading of all payment methods.
  if (window.geneCheckout?.paymentMethodsPrimary) {
    Object.keys(window.geneCheckout.paymentMethodsPrimary).forEach((paymentMethod) => {
      paymentMethodsPrimary[paymentMethod] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.geneCheckout.paymentMethodsPrimary[paymentMethod]
        )));
    });
  }

  return paymentMethodsPrimary;
};
