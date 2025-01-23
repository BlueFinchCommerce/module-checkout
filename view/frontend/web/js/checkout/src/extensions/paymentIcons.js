import { defineAsyncComponent } from 'vue';

export default () => {
  const paymentIcons = {};
  // Look at window.bluefinchCheckout.paymentIcons object to trigger the loading of all extra details.
  if (window.bluefinchCheckout?.paymentIcons) {
    Object.keys(window.bluefinchCheckout.paymentIcons).forEach((detailField) => {
      paymentIcons[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.bluefinchCheckout.paymentIcons[detailField]
        )));
    });
  }

  return paymentIcons;
};
