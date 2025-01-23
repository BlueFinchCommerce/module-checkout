import { defineAsyncComponent } from 'vue';

export default () => {
  const expressPaymentMethods = {};
  // Look at window.bluefinchCheckout.expressPaymentMethods object to trigger the loading of all extra details.
  if (window.bluefinchCheckout?.expressPaymentMethods) {
    Object.keys(window.bluefinchCheckout.expressPaymentMethods).forEach((detailField) => {
      expressPaymentMethods[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.bluefinchCheckout.expressPaymentMethods[detailField]
        )));
    });
  }

  return expressPaymentMethods;
};
