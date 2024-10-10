import { defineAsyncComponent } from 'vue';

export default () => {
  const shippingMethodAdditionalContainer = {};
  // Look at window.geneCheckout.shippingMethodAdditionalContainer object to trigger the loading of all extra details.
  if (window.geneCheckout?.shippingMethodAdditionalContainer) {
    Object.keys(window.geneCheckout.shippingMethodAdditionalContainer).forEach((detailField) => {
      shippingMethodAdditionalContainer[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.geneCheckout.shippingMethodAdditionalContainer[detailField]
        )));
    });
  }

  return shippingMethodAdditionalContainer;
};
