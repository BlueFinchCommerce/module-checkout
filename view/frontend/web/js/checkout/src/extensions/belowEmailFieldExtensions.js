import { defineAsyncComponent } from 'vue';

export default () => {
  const belowEmailFields = {};
  // Look at window.bluefinchCheckout.belowEmailFields object to trigger the loading of all extra details.
  if (window.bluefinchCheckout?.belowEmailFields) {
    Object.keys(window.bluefinchCheckout.belowEmailFields).forEach((detailField) => {
      belowEmailFields[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.bluefinchCheckout.belowEmailFields[detailField]
        )));
    });
  }

  return belowEmailFields;
};
