import { defineAsyncComponent } from 'vue';

export default () => {
  const ageCheckerContainer = {};
  // Look at window.bluefinchCheckout.ageCheckerContainer object to trigger the loading of all extra details.
  if (window.bluefinchCheckout?.ageCheckerContainer) {
    Object.keys(window.bluefinchCheckout.ageCheckerContainer).forEach((detailField) => {
      ageCheckerContainer[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.bluefinchCheckout.ageCheckerContainer[detailField]
        )));
    });
  }

  return ageCheckerContainer;
};
