import { defineAsyncComponent } from 'vue';

export default () => {
  const clickAndCollectComponent = {};
  // Look at window.geneCheckout.clickAndCollectComponent object to trigger the loading of all extra details.
  if (window.geneCheckout?.clickAndCollectComponent) {
    Object.keys(window.geneCheckout.clickAndCollectComponent).forEach((detailField) => {
      clickAndCollectComponent[detailField] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.geneCheckout.clickAndCollectComponent[detailField]
        )));
    });
  }

  return clickAndCollectComponent;
};
