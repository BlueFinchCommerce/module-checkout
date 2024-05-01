import { defineAsyncComponent } from 'vue';

export default () => {
  const belowEmailFields = {};
  // Look at window.geneCheckout.belowEmailFields object to trigger the loading of all extra details.
  if (window.geneCheckout?.belowEmailFields) {
    Object.keys(window.geneCheckout.belowEmailFields).forEach((detailField) => {
      belowEmailFields[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.geneCheckout.belowEmailFields[detailField]
        )));
    });
  }

  return belowEmailFields;
};
