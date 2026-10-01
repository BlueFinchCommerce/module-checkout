import { defineAsyncComponent } from 'vue';

export default () => {
  const belowOrderSummary = {};

  if (window.bluefinchCheckout?.belowOrderSummary) {
    Object.keys(window.bluefinchCheckout.belowOrderSummary).forEach((componentName) => {
      belowOrderSummary[componentName] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.bluefinchCheckout.belowOrderSummary[componentName]
        )
      ));
    });
  }

  return belowOrderSummary;
};
