import { defineAsyncComponent } from 'vue';

export default () => {
  const orderSummaryMessagesContainer = {};
  // Look at window.bluefinchCheckout.orderSummaryMessagesContainer object to trigger the loading of all extra details.
  if (window.bluefinchCheckout?.orderSummaryMessagesContainer) {
    Object.keys(window.bluefinchCheckout.orderSummaryMessagesContainer).forEach((detailField) => {
      orderSummaryMessagesContainer[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.bluefinchCheckout.orderSummaryMessagesContainer[detailField]
        )));
    });
  }

  return orderSummaryMessagesContainer;
};
