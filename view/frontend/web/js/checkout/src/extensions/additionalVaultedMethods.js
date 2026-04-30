import { defineAsyncComponent } from 'vue';
import VaultedMethodLoader from '@/components/Steps/PaymentPage/VaultedMethodLoader/VaultedMethodLoader.vue';

export default () => {
  const additionalVaultedMethods = {};
  // Look at window.bluefinchCheckout.additionalVaultedMethods object to trigger the loading of all payment methods.
  if (window.bluefinchCheckout?.additionalVaultedMethods) {
    Object.keys(window.bluefinchCheckout.additionalVaultedMethods).forEach((paymentMethod) => {
      additionalVaultedMethods[paymentMethod] = defineAsyncComponent({
        loader: () => (
          import(
            /* @vite-ignore */
            window.bluefinchCheckout.additionalVaultedMethods[paymentMethod]
          )
        ),
        loadingComponent: VaultedMethodLoader,
        delay: 0,
      });
    });
  }

  return additionalVaultedMethods;
};
