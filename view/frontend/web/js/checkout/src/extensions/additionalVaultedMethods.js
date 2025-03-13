import { defineAsyncComponent } from 'vue';

export default () => {
  const additionalVaultedMethods = {};
  // Look at window.bluefinchCheckout.additionalVaultedMethods object to trigger the loading of all payment methods.
  if (window.bluefinchCheckout?.additionalVaultedMethods) {
    Object.keys(window.bluefinchCheckout.additionalVaultedMethods).forEach((paymentMethod) => {
      additionalVaultedMethods[paymentMethod] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.bluefinchCheckout.additionalVaultedMethods[paymentMethod]
        )));
    });
  }

  return additionalVaultedMethods;
};
