import { defineAsyncComponent } from 'vue';

export default () => {
  const aboveVaultedMethods = {};
  // Look at window.bluefinchCheckout.aboveVaultedMethods object to trigger loading of all extra details.
  if (window.bluefinchCheckout?.aboveVaultedMethods) {
    Object.keys(window.bluefinchCheckout.aboveVaultedMethods).forEach((detailField) => {
      aboveVaultedMethods[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.bluefinchCheckout.aboveVaultedMethods[detailField]
        )));
    });
  }

  return aboveVaultedMethods;
};
