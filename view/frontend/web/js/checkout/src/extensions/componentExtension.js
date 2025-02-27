import { defineAsyncComponent } from 'vue';

export default (extensionPoint) => {
  const extensionPointComponents = {};
  // Look at window.bluefinchCheckout[extensionPoint] object to trigger the loading of all extra details.
  if (window.bluefinchCheckout?.[extensionPoint]) {
    Object.keys(window.bluefinchCheckout[extensionPoint]).forEach((component) => {
      extensionPointComponents[component] = defineAsyncComponent(() => (
        import(
          /* @vite-ignore */
          window.bluefinchCheckout[extensionPoint][component]
        )));
    });
  }
  return extensionPointComponents;
};
