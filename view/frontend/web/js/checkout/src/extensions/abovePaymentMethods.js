import { defineAsyncComponent } from 'vue';

export default () => {
  const abovePaymentMethods = {};
  // Look at window.bluefinchCheckout.abovePaymentMethods object to trigger the loading of all extra details.
  if (window.bluefinchCheckout?.abovePaymentMethods) {
    Object.keys(window.bluefinchCheckout.abovePaymentMethods).forEach((detailField) => {
      abovePaymentMethods[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.bluefinchCheckout.abovePaymentMethods[detailField]
        )));
    });
  }

  return abovePaymentMethods;
};
