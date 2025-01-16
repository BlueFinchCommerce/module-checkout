# BlueFinch Checkout - Custom Extension Guide

This guide covers how to extend BlueFinch Checkout with custom modules by adding new components, integrating additional functionality, creating callback functions and running your code effectively.

## How to extend BlueFinch Checkout functionality with a custom module
To use this functionality, the high level steps to follow are:

1. Create a new Magento 2 module as per [Magento standards](https://experienceleague.adobe.com/en/docs/commerce-learn/tutorials/backend-development/create-module).
1. Create a `view/frontend/templates` directory to add a .phtml template file for your module, in which you can declare custom callbacks, components, styles etc.
1. Create a `view/frontend/layouts` directory containing a `bluefinch_checkout_index.xml` XML layout file to include your modules .phtml template file in your stores BlueFinch Checkout page.
1. Create a `view/frontend/web/js/checkout/src/` directory containing your BlueFinch Checkout extension code.

**Please refer to our template for creating BlueFinch Checkout modules [here](https://github.com/genecommerce/bluefinch-checkout-new-module-template)**, which has all the necssary files required, including those for building the front end assets.

## How to add a new component

### Set up a component file:
1. Navigate to the `view/frontend/js/checkout/src` directory within your module.
1. Here, create your component file in the `components` directory.
1. Each new component file should have a unique name and relevant logic for your checkout modification.

### Render the component:

We use (Vue dynamic components)[https://vuejs.org/guide/essentials/component-basics#dynamic-components] and the `<component>` element, to provide component extension points to render your component(s):

### Global

| Extension Point                 | Usage                                              |
| ------------------------------- | -------------------------------------------------- |
| orderSummaryMessagesContainer   | Insert a component after order summary total       |
| footerPaymentIcons              | Insert a component before the footer payment icons |
----------------------------------------------------------------------------------------

![Global Extension Points](global-extension-points.png)

### Details Page

| Extension Point                 | Usage                                                                                              |
| ------------------------------- | -------------------------------------------------------------------------------------------------- |
| expressPaymentMethods           | Insert a component after the last express payment method e.g. An additional express payment method |
| paymentIcons                    | Insert a component before the payment method icons container e.g. Some welcome text                |
| belowEmailFields                | Insert a component after the email field                                                           |
| clickAndCollectComponent        | Insert a component after the click and collect section                                             |
| ageCheckerContainer             | Insert a component after the details section e.g. Age Checker                                      |
----------------------------------------------------------------------------------------------------------------------------------------

![Details Page Extension Points](details-page-extension-points.png)

### Shipping Page

| Extension Point                   | Usage                                                                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| ageCheckerContainer               | Insert a component before the shipping methods container e.g. age checker                                                      |
| shippingMethodAdditionalContainer | Insert a component before the first shipping method e.g. An additional shipping method that you want to be your primary method |
| shippingMethods                   | Insert a component after the last shipping method e.g. An additional shipping method                                           |
| belowShippingMethods              | Insert a component after the shipping methods container e.g. delivery instructions                                             |
----------------------------------------------------------------------------------------------------------------------------------------------------------------------

![Shipping Page Extension Points](shipping-page-extension-points.png)

### Payment Page

| Extension Point          | Usage                                                                                                                        |
| -------------------------| ---------------------------------------------------------------------------------------------------------------------------- |
| ageCheckerContainer      | Insert a component before the payment methods container e.g. age checker                                                     |
| additionalVaultedMethods | Insert a component after the last vaulted method e.g. An additional vaulted method                                           |
| paymentMethodsPrimary    | Insert a component before the first payment method e.g. An additional payment method that you want to be your primary method |
| paymentMethods           | Insert a component after the last payment method e.g. An additional payment method                                           |
-----------------------------------------------------------------------------------------------------------------------------------------------------------

![Payment Page Extension Points](payment-page-extension-points.png)

Example of an extension point in BlueFinch Checkout:

```html
<component
    :is="additionalShippingMethod"
    v-for="additionalShippingMethod in additionalShippingMethods"
    :key="additionalShippingMethod"
/>
```

After you have selected the component extension point for your custom component, you need to register it in the modules .phtml file, via the global `window.bluefinchCheckout` namespace:

1. Add the global `window.bluefinchCheckout` namespace.
1. Add the component extension point namespace, to the global `window.bluefinchCheckout` namespace.
1. Add your components namespace to the extension points namespace, then set the value to the path of the compiled and minified component js file name in the `checkout/dist` directory.

Example:

```html
<script>
    window.bluefinchCheckout = window.bluefinchCheckout || {};
    window.bluefinchCheckout.belowShippingMethods = window.bluefinchCheckout.belowShippingMethods || {};

    window.bluefinchCheckout.belowShippingMethods.newComponent = "<?= $escaper->escapeJs($block->getViewFileUrl('ModuleNamespace_ModuleName::js/checkout/dist/components/NewComponent/NewComponent.min.js')) ?>";
</script>
```
To render your component locally, see [local workflow](../.github/CONTRIBUTING.md#local-workflow).

## How to create callback functions
Callback functions enable you to define custom responses to various checkout events.

You can choose from the available callback extension points listed below, to integrate your functionionality effectively:

### Event-based Extension Points
1. onBraintreeExpressInit
1. onCreate
1. onDeliveryTabEvent
1. onEditAddress
1. onHandleCartData
1. onLogin
1. onPaymentDataChanged
1. onSetShippingStep
1. onShippingMethodMounted
1. onStepsCreated
1. onSubmitShippingOptionAgeCheck
1. onUserProceed

### Function Extension Points
1. getAppliedCoupons
1. getBillingAddress
1. getCrossSellsHeader
1. getFullCart
1. getGiftCards
1. getGiftWrapping
1. getIsVirtual
1. getItems
1. getPaymentMethods
1. getPrices
1. getRewardPoints
1. getShippingAddresses
1. getShippingMethods
1. getStoreCredit

### Add your code:

After you have selected the function extension point for your custom component, you need to create a callback file in your modules `view/frontend/js/checkout/src/callbacks` directory.

BlueFinch Checkout exports it's components, helpers, router, services and stores, so you can load any of these in for use in your custom module using:

`view/frontend/web/js/checkout/src/helpers/extensionData/loadFromCheckout.js`

Please refer to the `index.js` in each of their respective directories under `src` to see what is available.

You then you can register your callback in the modules .phtml file, via the global `window.bluefinchCheckout` namespace:

1. Add the global `window.bluefinchCheckout` namespace.
1. Add the `callbacks` namespace to the `window.bluefinchCheckout` namespace.
1. Add the function extension point namespace, to the global `window.bluefinchCheckout` namespace.
1. Add your components namespace to the extension points namespace, then set the value to the path of the compiled and minified component js file name in the `checkout/dist` directory.

Example:

```html
<script>
    window.bluefinchCheckout = window.bluefinchCheckout || {};
    window.bluefinchCheckout.callbacks = window.bluefinchCheckout.callbacks || {};
    window.bluefinchCheckout.callbacks.onLogin = window.bluefinchCheckout.callbacks.onLogin || {};

    window.bluefinchCheckout.callbacks.onLogin.newModuleOnLogin = "<?= $escaper->escapeJs($block->getViewFileUrl('ModuleNamespace_ModuleName::js/checkout/dist/callbacks/onLogin.min.js')) ?>";
</script>
```

To test your function extension on the front end, see [local workflow](../.github/CONTRIBUTING.md#local-workflow).

## How to change styling

For adding styles to your **component**, you can:
1. Create a new component scss file in `view/frontend/web/js/checkout/src/components/newComponent/newComponent.scss` with your required styles. **We recommend that the name of your scss file(s) should be unique within your module.** This helps to avoid any build time compilation issues, when you have the need for multiple components, each with it's own scss file.
1. Register it in the modules .phtml using a html link element, for example `<link rel="stylesheet" href="<?= $escaper->escapeHtmlAttr($block->getViewFileUrl('ModuleNamespace_ModuleName::js/checkout/dist/newComponent.css')) ?>" />`
1. Build your code, see [local workflow](../.github/CONTRIBUTING.md#local-workflow)

You also have two other options for changing styles:
1. We provide an Admin designer where you change variables for colours/font/text via configuration.
    1. Log into the Magento admin area, then: Stores > Configuration (Select your store if multi store) > BlueFinch > Checkout > General > Checkout Designer
    1. Click on the `Open Designer` button and you can change these values in our interactive preview.
1. Amend the styles following the standard Magento process in your custom theme by creating a `web/css/checkout.less` and and overriding the variables and/or styles from the BlueFinch Checkout theme and admin designer settings. Example:

```
:root.vue-checkout-active #bluefinch-checkout-root {
    // Fonts
    --font-weight__semibold: 600;
    --font-weight__bold: 700;
}
```

## Remove checkout styles from your theme

We recommend that you remove any unused Magento Checkout styles within your custom theme, that are not BlueFinch Checkout related, so they are not generated in the CSS for the rest of your site.