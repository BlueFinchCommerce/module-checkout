# Gene Better Checkout Module - Custom Extension Guide

This guide covers how to extend the Gene_BetterCheckout module by adding new components, 
integrating additional functionality, creating callback functions, and running your code effectively.

Template of example module placed **[here](https://github.com/genecommerce/better-checkout-new-module-template)**.

---

## How to Extend Gene_BetterCheckout Functionality with a Custom Module
To use this functionality, follow these steps:

1. Create new magento2 module as per magento standarts.
2. Create templates dir to add module.phtml where later you will declare custom callback/components/styles.
3. Create layouts folder with genebettercheckout_checkout_index.xml file where you register your module.phtml file.

---
## How to Add a New Component

### Set Up Component File:
Navigate to the view/frontend/js/checkout/src directory within your module.
Here, create your component file in the components' directory. 
Each new component file should have a unique name and relevant logic for your checkout modification.

### Register the Component:
To make the component functional you can use already existed componentExtension points:

1. paymentMethod
2. paymentMethodsPrimary
3. vaultedMethod
4. ageCheckerExtension
5. footerPaymentIcon
6. belowShippingMethods
7. additionalShippingMethod
8. shippingMethodAdditionalContainer
9. paymentIcon
10. orderSummaryMessagesContainer
11. expressPaymentMethod
12. clickAndCollectComponent 

After you selected required placement or your customer component you need to register it in the module.phtml file.
Example can be found in the template module.

---

## How to Create Callback Functions
Callback functions enable you to define custom responses to various checkout events.


### Choose from the available callback extension points to integrate your function effectively:

1. onLogin
2. onSetShippingStep
3. onHandleCartData
4. onBraintreeExpressInit
5. onUserProceed
6. onSubmitShippingOptionAgeCheck
7. onEditAddress
8. onDeliveryTabEvent
9. getCrossSellsHeader
10. getAppliedCoupons
11. onShippingMethodMounted
12. getRewardPoints
13. getPrices
14. getItems
15. getPaymentMethods
16. getIsVirtual
17. getShippingAddresses
18. getGiftWrapping
19. getGiftCards
20. getFullCart
21. getBillingAddress
22. getStoreCredit
23. onStepCreated
24. belowEmailFieldExtension
25. onCreate
26. onPaymentDataChanged
27. getShippingMethods

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