import { defineAsyncComponent } from 'vue';

export default () => {
  const clickAndCollectComponent = {};
  // Look at window.bluefinchCheckout.clickAndCollectComponent object to trigger the loading of all extra details.
  if (window.bluefinchCheckout?.clickAndCollectComponent) {
    Object.keys(window.bluefinchCheckout.clickAndCollectComponent).forEach((detailField) => {
      clickAndCollectComponent[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.bluefinchCheckout.clickAndCollectComponent[detailField]
        )));
    });
  }

  return clickAndCollectComponent;
};
