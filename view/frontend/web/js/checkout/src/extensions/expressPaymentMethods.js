import { defineAsyncComponent } from 'vue';

export default () => {
  const expressPaymentMethods = {};
  // Look at window.geneCheckout.expressPaymentMethods object to trigger the loading of all extra details.
  if (window.geneCheckout?.expressPaymentMethods) {
    Object.keys(window.geneCheckout.expressPaymentMethods).forEach((detailField) => {
      expressPaymentMethods[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.geneCheckout.expressPaymentMethods[detailField]
        )));
    });
  }

  return expressPaymentMethods;
};
