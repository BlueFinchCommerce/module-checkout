# Gene Better Checkout Module - Custom Extension Guide

This guide covers how to extend the Gene_BetterCheckout module by adding new components, 
integrating additional functionality, creating callback functions and running your code effectively..

You can find our template for creating Better Checkout modules **[here](https://github.com/genecommerce/better-checkout-new-module-template)**.

---

## How to Extend Gene_BetterCheckout Functionality with a Custom Module
To use this functionality, follow these steps:

1. Create new Magento 2 module as per Magento standards.
   **[Magento2 documentation](https://experienceleague.adobe.com/en/docs/commerce-learn/tutorials/backend-development/create-module)**.
2. Create a `templates` folder to add a .phtml template file for your module, in which you can declare custom callback, components, styles etc.
3. Create a `layouts` folder containing a `genebettercheckout_checkout_index.xml` XML layout file where you can register your modules .phtml template file.

---
## How to Add a New Component

### Set Up Component File:
Navigate to the view/frontend/js/checkout/src directory within your module.
Here, create your component file in the components' directory. 
Each new component file should have a unique name and relevant logic for your checkout modification.

### Register the Component:
To make the component functional you can use already existed componentExtension points in alphabetical order:

1. additionalShippingMethod 
2. ageCheckerExtension 
3. belowShippingMethods 
4. clickAndCollectComponent 
5. expressPaymentMethod 
6. footerPaymentIcon 
7. orderSummaryMessagesContainer 
8. paymentIcon 
9. paymentMethod 
10. paymentMethodsPrimary 
11. shippingMethodAdditionalContainer 
12. vaultedMethod

After you selected required placement or your customer component you need to register it in the module.phtml file.
Example can be found in the template module.

---

## How to Create Callback Functions
Callback functions enable you to define custom responses to various checkout events.


### Choose from the available callback extension points to integrate your function effectively:

Event-based Extension Points
1. onBraintreeExpressInit 
2. onCreate 
3. onDeliveryTabEvent 
4. onEditAddress 
5. onHandleCartData 
6. onLogin 
7. onPaymentDataChanged 
8. onSetShippingStep 
9. onShippingMethodMounted 
10. onStepCreated 
11. onSubmitShippingOptionAgeCheck 
12. onUserProceed

Function Extension Points
1. belowEmailFieldExtension 
2. getAppliedCoupons 
3. getBillingAddress 
4. getCrossSellsHeader 
5. getFullCart 
6. getGiftCards 
7. getGiftWrapping 
8. getIsVirtual 
9. getItems 
10. getPaymentMethods 
11. getPrices 
12. getRewardPoints 
13. getShippingAddresses 
14. getShippingMethods 
15. getStoreCredit

These extension points can be leveraged across services, helpers, stores, 
and components to enrich checkout functionality. 
Use them, for example, to incorporate custom fields into GraphQL requests or to streamline the integration of any additional checkout requirements.

---

### Add Your Code:

Navigate to view/frontend/js/checkout/src/callbacks and create your custom callback file.
Write the logic to trigger on your selected event and register it in the appropriate checkout configuration.
You can use an example of callback function in the template module to extend existing event functionality.

---

## How to change styling

For changing styling of your component you need
1. create new styles.scss file
2. register it in the module.phtml as per template module
3. run build command as per instructions below

For changes in the checkout styles without creation extension functionality:
1. you can use admin designer and change variables for colours/font/text
2. you can go with magento2 flow and create Gene_BetterCheckout folder in your magento theme. 
After that create web/css folder and create checkout.less file where you could override checkout variables in the code.
In this case your changes will override admin designer values from admin panel.

example of code for second option:

``` 
:root.vue-checkout-active #gene-better-checkout-root {
    // Fonts
    --font-weight__semibold: 600;
    --font-weight__bold: 700;
}
```

---

## How to Run Your Code
Once you have completed the setup, follow these steps to build and run your code:

### Navigate to the Checkout Directory:


``` cd view/frontend/js/checkout ``` 

Install Dependencies:
Ensure all necessary packages are installed:

``` npm install ```

Build the Project:
Compile your code with:

``` npm run build ```
After building, your code should be ready to test.

---