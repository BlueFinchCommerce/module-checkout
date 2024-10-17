import { defineAsyncComponent } from 'vue';

export default () => {
  const additionalVaultedMethods = {};
  // Look at window.geneCheckout.additionalVaultedMethods object to trigger the loading of all payment methods.
  if (window.geneCheckout?.additionalVaultedMethods) {
    Object.keys(window.geneCheckout.additionalVaultedMethods).forEach((paymentMethod) => {
      additionalVaultedMethods[paymentMethod] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.geneCheckout.additionalVaultedMethods[paymentMethod]
        )));
    });
  }

  return additionalVaultedMethods;
};
