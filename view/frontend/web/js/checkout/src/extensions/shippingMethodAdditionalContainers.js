import { defineAsyncComponent } from 'vue';

export default () => {
  const shippingMethodAdditionalContainer = {};
  // Look at window.bluefinchCheckout.shippingMethodAdditionalContainer
  // object to trigger the loading of all extra details.
  if (window.bluefinchCheckout?.shippingMethodAdditionalContainer) {
    Object.keys(window.bluefinchCheckout.shippingMethodAdditionalContainer).forEach((detailField) => {
      shippingMethodAdditionalContainer[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.bluefinchCheckout.shippingMethodAdditionalContainer[detailField]
        )));
    });
  }

  return shippingMethodAdditionalContainer;
};
