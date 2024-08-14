import { defineAsyncComponent } from 'vue';

export default () => {
  const footerPaymentIcons = {};
  // Look at window.geneCheckout.footerPaymentIcons object to trigger the loading of all extra details.
  if (window.geneCheckout?.footerPaymentIcons) {
    Object.keys(window.geneCheckout.footerPaymentIcons).forEach((detailField) => {
      footerPaymentIcons[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.geneCheckout.footerPaymentIcons[detailField]
        )));
    });
  }

  return footerPaymentIcons;
};
