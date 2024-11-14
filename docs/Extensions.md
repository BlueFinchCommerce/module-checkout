# Better Checkout - Custom Extension Guide

This guide covers how to extend Better Checkout with custom modules by adding new components, integrating additional functionality, creating callback functions and running your code effectively.

## How to extend Better Checkout functionality with a custom module
To use this functionality, the high level steps to follow are:

1. Create a new Magento 2 module as per [Magento standards](https://experienceleague.adobe.com/en/docs/commerce-learn/tutorials/backend-development/create-module).
1. Create a `view/frontend/templates` directory to add a .phtml template file for your module, in which you can declare custom callbacks, components, styles etc.
1. Create a `view/frontend/layouts` directory containing a `genebettercheckout_checkout_index.xml` XML layout file to include your modules .phtml template file in your stores Better Checkout page.
1. Create a `view/frontend/web/js/checkout/src/` directory containing your Better Checkout extension code.

**Please refer to our template for creating Better Checkout modules [here](https://github.com/genecommerce/better-checkout-new-module-template)**, which has all the necssary files required, including those for building the front end assets.

## How to add a new component

### Set up a component file:
1. Navigate to the `view/frontend/js/checkout/src` directory within your module.
1. Here, create your component file in the `components` directory. 
1. Each new component file should have a unique name and relevant logic for your checkout modification.

### Render the component:

We use Vue dynamic components and the `<component>` element, to provide component extension points to render your component(s):

1. additionalShippingMethod
1. additionalVaultedMethod
1. ageCheckerExtension
1. belowEmailFieldExtension
1. belowShippingMethods
1. clickAndCollectComponent
1. expressPaymentMethod
1. footerPaymentIcon
1. orderSummaryMessagesContainer
1. paymentIcon
1. paymentMethod
1. paymentMethodsPrimary
1. shippingMethodAdditionalContainer

Example of an extension point in Better Checkout:

```html
<component
    :is="additionalShippingMethod"
    v-for="additionalShippingMethod in additionalShippingMethods"
    :key="additionalShippingMethod"
/>
```

After you have selected the component extension point for your custom component, you need to register it in the modules .phtml file, via the global `window.geneCheckout` namespace:

1. Add the global `window.geneCheckout` namespace.
1. Add the component extension point namespace, to the global `window.geneCheckout` namespace.
1. Add your components namespace to the extension points namespace, then set the value to the path of the compiled and minified component js file name in the `checkout/dist` directory.

Example:

```html
<script>
    window.geneCheckout = window.geneCheckout || {};
    window.geneCheckout.belowShippingMethods = window.geneCheckout.belowShippingMethods || {};

    window.geneCheckout.belowShippingMethods.newComponent = "<?= $escaper->escapeJs($block->getViewFileUrl('ModuleNamespace_ModuleName::js/checkout/dist/components/NewComponent/NewComponent.min.js')) ?>";
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

Better Checkout exports it's components, helpers, router, services and stores, so you can load any of these in for use in your custom module using:

`view/frontend/web/js/checkout/src/helpers/extensionData/loadFromCheckout.js` 

Please refer to the `index.js` in each of their respective directories under `src` to see what is available.

You then you can register your callback in the modules .phtml file, via the global `window.geneCheckout` namespace:

1. Add the global `window.geneCheckout` namespace.
1. Add the `callbacks` namespace to the `window.geneCheckout` namespace.
1. Add the function extension point namespace, to the global `window.geneCheckout` namespace.
1. Add your components namespace to the extension points namespace, then set the value to the path of the compiled and minified component js file name in the `checkout/dist` directory.

Example:

```html
<script>
    window.geneCheckout = window.geneCheckout || {};
    window.geneCheckout.callbacks = window.geneCheckout.callbacks || {};
    window.geneCheckout.callbacks.onLogin = window.geneCheckout.callbacks.onLogin || {};

    window.geneCheckout.callbacks.onLogin.newModuleOnLogin = "<?= $escaper->escapeJs($block->getViewFileUrl('ModuleNamespace_ModuleName::js/checkout/dist/callbacks/onLogin.min.js')) ?>";
</script>
```

To test your function extension on the front end, see [local workflow](../.github/CONTRIBUTING.md#local-workflow).

## How to change styling

For adding styles for your **component**, you can:
1. Create a new component scss file in `view/frontend/web/js/checkout/src/components/newComponent/newComponent.scss` with your required styles.
1. Register it in the modules .phtml using a html link element, for example `<link rel="stylesheet" href="<?= $escaper->escapeHtmlAttr($block->getViewFileUrl('ModuleNamespace_ModuleName::js/checkout/dist/newComponent.css')) ?>" />`
1. Build your code, see [local workflow](../.github/CONTRIBUTING.md#local-workflow)

You also have two other options for changing styles:
1. We provide an Admin designer where you change variables for colours/font/text via configuration.
    1. Log into the Magento admin area, then: Stores > Configuration (Select your store if multi store) > Gene > Better Checkout > General > Checkout Designer
    1. Click on the `Open Designer` button and you can change these values in our interactive preview.
1. Amend the styles following the standard Magento process in your custom theme by creating a `web/css/checkout.less` and overriding the variables and/or styles. Example:

``` 
:root.vue-checkout-active #gene-better-checkout-root {
    // Fonts
    --font-weight__semibold: 600;
    --font-weight__bold: 700;
}
```