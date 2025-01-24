import { defineAsyncComponent } from 'vue';

export default () => {
  const paymentMethodsPrimary = {};
  // Look at window.bluefinchCheckout.paymentMethodsPrimary object to trigger the loading of all payment methods.
  if (window.bluefinchCheckout?.paymentMethodsPrimary) {
    Object.keys(window.bluefinchCheckout.paymentMethodsPrimary).forEach((paymentMethod) => {
      paymentMethodsPrimary[paymentMethod] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.bluefinchCheckout.paymentMethodsPrimary[paymentMethod]
        )));
    });
  }

  return paymentMethodsPrimary;
};
