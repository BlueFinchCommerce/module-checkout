import { defineAsyncComponent } from 'vue';

export default () => {
  const paymentIcons = {};
  // Look at window.geneCheckout.paymentIcons object to trigger the loading of all extra details.
  if (window.geneCheckout?.paymentIcons) {
    Object.keys(window.geneCheckout.paymentIcons).forEach((detailField) => {
      paymentIcons[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.geneCheckout.paymentIcons[detailField]
        )));
    });
  }

  return paymentIcons;
};
