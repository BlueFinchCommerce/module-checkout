import { defineAsyncComponent } from 'vue';

export default () => {
  const additionalDetailContainer = {};
  // Look at window.bluefinchCheckout.additionalDetailContainer object to trigger the loading of all extra details.
  if (window.bluefinchCheckout?.additionalDetailContainer) {
    Object.keys(window.bluefinchCheckout.additionalDetailContainer).forEach((detailField) => {
      additionalDetailContainer[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.bluefinchCheckout.additionalDetailContainer[detailField]
        )));
    });
  }

  return additionalDetailContainer;
};
