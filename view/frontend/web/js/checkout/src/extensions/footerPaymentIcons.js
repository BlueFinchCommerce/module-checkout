import { defineAsyncComponent } from 'vue';

export default () => {
  const footerPaymentIcons = {};
  // Look at window.bluefinchCheckout.footerPaymentIcons object to trigger the loading of all extra details.
  if (window.bluefinchCheckout?.footerPaymentIcons) {
    Object.keys(window.bluefinchCheckout.footerPaymentIcons).forEach((detailField) => {
      footerPaymentIcons[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.bluefinchCheckout.footerPaymentIcons[detailField]
        )));
    });
  }

  return footerPaymentIcons;
};
