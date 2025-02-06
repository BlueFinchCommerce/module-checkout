import { defineAsyncComponent } from 'vue';

export default () => {
  const belowShippingMethods = {};
  // Look at window.bluefinchCheckout.belowShippingMethods object to trigger the loading of all extra details.
  if (window.bluefinchCheckout?.belowShippingMethods) {
    Object.keys(window.bluefinchCheckout.belowShippingMethods).forEach((detailField) => {
      belowShippingMethods[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.bluefinchCheckout.belowShippingMethods[detailField]
        )));
    });
  }

  return belowShippingMethods;
};
