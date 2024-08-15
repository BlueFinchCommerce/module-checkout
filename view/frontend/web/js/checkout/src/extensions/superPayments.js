import { defineAsyncComponent } from 'vue';

export default () => {
  const superPaymentsContainer = {};
  // Look at window.geneCheckout.superPaymentsContainer object to trigger the loading of all extra details.
  if (window.geneCheckout?.superPaymentsContainer) {
    Object.keys(window.geneCheckout.superPaymentsContainer).forEach((detailField) => {
      superPaymentsContainer[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.geneCheckout.superPaymentsContainer[detailField]
        )));
    });
  }

  return superPaymentsContainer;
};
