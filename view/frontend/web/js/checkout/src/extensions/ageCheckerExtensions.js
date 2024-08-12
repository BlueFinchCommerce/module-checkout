import { defineAsyncComponent } from 'vue';

export default () => {
  const ageCheckerContainer = {};
  // Look at window.geneCheckout.ageCheckerContainer object to trigger the loading of all extra details.
  if (window.geneCheckout?.ageCheckerContainer) {
    Object.keys(window.geneCheckout.ageCheckerContainer).forEach((detailField) => {
      ageCheckerContainer[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.geneCheckout.ageCheckerContainer[detailField]
          )));
    });
  }
  
  return ageCheckerContainer;
};
