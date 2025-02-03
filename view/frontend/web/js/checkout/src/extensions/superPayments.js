import { defineAsyncComponent } from 'vue';

export default () => {
  const superPaymentsContainer = {};
  // Look at window.bluefinchCheckout.superPaymentsContainer object to trigger the loading of all extra details.
  if (window.bluefinchCheckout?.superPaymentsContainer) {
    Object.keys(window.bluefinchCheckout.superPaymentsContainer).forEach((detailField) => {
      superPaymentsContainer[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.bluefinchCheckout.superPaymentsContainer[detailField]
        )));
    });
  }

  return superPaymentsContainer;
};
