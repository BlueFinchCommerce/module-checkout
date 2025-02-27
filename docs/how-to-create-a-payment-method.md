![BlueFinch Checkout](../assets/logo.svg)

# BlueFinch Checkout - Create a payment method

This guide covers how to create a custom payment method and integrate that within the BlueFinch Checkout.

This guide will contain mainly boilerplate or example code but the [Adyen compatibility module](https://github.com/BlueFinchCommerce/module-checkout-adyen) has examples of a working payment method integration.

## Prerequisites

This guide assumes knowledge of how BlueFinch Checkout extension modules are structured. If not please refer to the [How to create a checkout extension module](how-to-create-a-checkout-extension-module.md) guide.

We have provided a [template module](https://github.com/BlueFinchCommerce/module-checkout-template) that contains most of the boilerplate code that is required to get BlueFinch Checkout extensions working and is recommended as the base of all new modules.

## How to add a new express payment method

### Extension point - expressPaymentMethods

1. Copy the example [express payment component](https://github.com/BlueFinchCommerce/module-checkout-template/tree/develop/view/frontend/web/js/checkout/src/components) into your module with the same path structure.

2. Create a new template file that is displayed on the `bluefinchcheckout_checkout_index.xml` layout file.

3. Using the [example module](https://github.com/BlueFinchCommerce/module-checkout-template/blob/develop/view/frontend/templates/new-module.phtml) take the markup that adds the component definition to the window object:

```html
<script>
    window.bluefinchCheckout = window.bluefinchCheckout || {};
    // bluefinch express payment method extension
    window.bluefinchCheckout.expressPaymentMethods = window.bluefinchCheckout.expressPaymentMethods || {};
    window.bluefinchCheckout.expressPaymentMethods.myModuleExpressPaymentMethod = "<?= $escaper->escapeJs($block->getViewFileUrl('ModuleNamespace_ModuleName::js/checkout/dist/components/expressPayment/expressPayment.min.js')) ?>";
</script>
```

    Replacing `ModuleNamespace_ModuleName` with the appropriate name of your module.

3. Run the build script from within the `ModuleNamespace_ModuleName::js/checkout/src` folder.

    If you haven't already copied the boilerplate npm package setup from the root of [`"src"` template module](https://github.com/BlueFinchCommerce/module-checkout-template/tree/develop/view/frontend/web/js/checkout) you will need to do this.

```bash
// With the package.json and rollup.config.js files copied across
npm i
npm run build
```

4. Clear your Adobe Commerce caches and reload the checkout. You will see the text `New Component - Express Payment` visible underneath any existing express payment methods.

### Extension point - additionalVaultedMethods / paymentMethodsPrimary / paymentMethods

These extensions points allow for creation of payment methods that will appear on the final payment step of the BlueFinch Checkout.

The different between the names is to do with the location at which the extension will appear. Refer to the [Payment Page Extension Points](payment-page-extension-points.png) image for more information.

1. Copy the example [payment component](https://github.com/BlueFinchCommerce/module-checkout-template/tree/develop/view/frontend/web/js/checkout/src/components) into your module with the same path structure.

2. Create a new template file that is displayed on the `bluefinchcheckout_checkout_index.xml` layout file.

3. Using the [example module](https://github.com/BlueFinchCommerce/module-checkout-template/blob/develop/view/frontend/templates/new-module.phtml) take the markup that adds the component definition to the window object:

```html
<script>
    window.bluefinchCheckout = window.bluefinchCheckout || {};
    // bluefinch express payment method extension
    window.bluefinchCheckout.paymentMethods = window.bluefinchCheckout.paymentMethods || {};
    window.bluefinchCheckout.paymentMethods.myModuleExpressPaymentMethod = "<?= $escaper->escapeJs($block->getViewFileUrl('ModuleNamespace_ModuleName::js/checkout/dist/components/paymentMethods/paymentMethods.min.js')) ?>";
</script>
```

    Replacing `ModuleNamespace_ModuleName` with the appropriate name of your module.

3. Run the build script from within the `ModuleNamespace_ModuleName::js/checkout/src` folder.

    If you haven't already copied the boilerplate npm package setup from the root of [`"src"` template module](https://github.com/BlueFinchCommerce/module-checkout-template/tree/develop/view/frontend/web/js/checkout) you will need to do this.

```bash
// With the package.json and rollup.config.js files copied across
npm i
npm run build
```

We have [documentation about running locally](https://github.com/BlueFinchCommerce/module-checkout/blob/develop/.github/CONTRIBUTING.md#local-frontend-development-workflow) as well to aid with development.

4. Clear your Adobe Commerce caches and reload the checkout. You will see the text `New Component - Payment Method` visible underneath any existing express payment methods.
