import { defineAsyncComponent } from 'vue';

export default () => {
  const belowShippingMethods = {};
  // Look at window.geneCheckout.belowShippingMethods object to trigger the loading of all extra details.
  if (window.geneCheckout?.belowShippingMethods) {
    Object.keys(window.geneCheckout.belowShippingMethods).forEach((detailField) => {
      belowShippingMethods[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.geneCheckout.belowShippingMethods[detailField]
        )));
    });
  }

  return belowShippingMethods;
};
