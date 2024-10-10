import { defineAsyncComponent } from 'vue';

export default () => {
  const orderSummaryMessagesContainer = {};
  // Look at window.geneCheckout.orderSummaryMessagesContainer object to trigger the loading of all extra details.
  if (window.geneCheckout?.orderSummaryMessagesContainer) {
    Object.keys(window.geneCheckout.orderSummaryMessagesContainer).forEach((detailField) => {
      orderSummaryMessagesContainer[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.geneCheckout.orderSummaryMessagesContainer[detailField]
        )));
    });
  }

  return orderSummaryMessagesContainer;
};
