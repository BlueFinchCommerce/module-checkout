import { defineAsyncComponent } from 'vue';

export default () => {
  const orderSummaryAdditionalTotalRow = {};
  // Look at window.bluefinchCheckout.orderSummaryAdditionalTotalRow object to trigger the loading of all extra details.
  if (window.bluefinchCheckout?.orderSummaryAdditionalTotalRow) {
    Object.keys(window.bluefinchCheckout.orderSummaryAdditionalTotalRow).forEach((detailField) => {
      orderSummaryAdditionalTotalRow[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.bluefinchCheckout.orderSummaryAdditionalTotalRow[detailField]
        )));
    });
  }

  return orderSummaryAdditionalTotalRow;
};
