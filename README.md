[![CircleCI](https://dl.circleci.com/status-badge/img/gh/BlueFinchCommerce/module-checkout/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/BlueFinchCommerce/module-checkout/tree/main)

![BlueFinch Checkout](./assets/logo.svg)

# BlueFinch Checkout

The BlueFinch Checkout has been designed and developed to provide a performant, best in class, and easily customisable checkout for your Adobe store. Built in Vue and adhering to UX best practices, this checkout allows customers to seamlessly transact whilst also allowing merchants to get up and running quickly with easy installation and the ability to style and amend the checkout from right within the magento platform.

## Features

The BlueFinch Checkout has a wealth of features which make it the checkout of choice for Adobe websites.

Features include:

- **Checkout Designer** - full control over the colours, text and styles of your checkout controlled in the admin without the need for development.
- **Instant Checkout** - compatible with payment wallets at the top of the checkout including Apple Pay and Google Pay to help users transact faster.
- **UX Best Practice** - our Checkout utilises UX best practices and has been thoroughly user tested to ensure the optimal user experience.
Streamlined Flow - reduced touch points for the user with preselected delivery and payment methods.
- **Simple Installation** - follows the standard installation process for Adobe Commerce modules.
- **Easy to Extend** - developers can create their own modules that hook into the extension points provided to re-use components or functionality, or add their own.
- **Fast loading** - a performant checkout ensuring quick seamless transactions for all customers.
- **Validation** - positive and negative validation is incorporated into every step to affirm to the user when a field is correctly completed and alert the user when a field has been incorrectly completed or missed.
- **Cross Sells in checkout** - increase your AOV and ensure the user has not forgotten any ancillary products or can reach a minimum delivery threshold by populating and displaying cross sell products in the checkout.
- **Optional Progress Bar** - configurable for desktop to highlight to the user where they are in their checkout journey and easily navigate through the stages.
- **Enhanced Order Success Page** - introducing our enhanced order success page allowing guest users to create an account by simply entering a password and displaying a comprehensive order summary with products, prices and order number information.
- **Enhanced Event Tracking** - BlueFinch Checkout comes with enhanced event tracking to allow you to create granular reports within GA4 on how users are interacting with the checkout.
- **3rd Party Compatibility** - BlueFinch Checkout is compatible with a wide range of third-party partners including Braintree, PayPal Complete Payments,  Loqate, WebShopApps, AFD, Age Checker, Braintree, Adyen and more.

## Requirements

- Magento 2.4.6 or higher
- Node 16 or higher (for development purposes only)

## Installation

To install the BlueFinch Checkout module, run the following command in your Magento 2 root directory:

``` composer require bluefinchcommerce/module-checkout ```

BlueFinch Checkout follows the standard installation process for Adobe Commerce.

For information about a module installation in Adobe Commerce, see [Enable or disable modules](https://experienceleague.adobe.com/en/docs/commerce-operations/installation-guide/tutorials/manage-modules).

To enable the BlueFinch Checkout on your store, log into the Magento admin area, then:

Stores > Configuration (Select your store if multi store) > BlueFinch > Checkout > General - Enable Module: Yes

Remember to clear any appropriate caches.

## Documentation

- [Contributing](.github/CONTRIBUTING.md)
    - [Local frontend development workflow](.github/CONTRIBUTING.md#local-frontend-development-workflow)
    - [Branching strategy](.github/CONTRIBUTING.md#branching-strategy)
    - [Making a release](.github/CONTRIBUTING.md#making-a-release)
- [Custom extension guide](docs/Extensions.md)
- [How to create a checkout extension module](docs/how-to-create-a-checkout-extension-module.md)
- [How to create payment methods](docs/how-to-create-a-payment-method.md)
- [GA4 Custom Event Tracking](docs/ga4-custom-event-tracking.md)

### BlueFinch Checkout extension modules

You can find our template for creating BlueFinch Checkout extension modules **[here](https://github.com/bluefinchcommerce/module-checkout-new-module-template)**.

## Default payment support

By default, BlueFinch Checkout includes support for Braintree payments.

If your site is using Adyen as the payment provider, you can install the [BlueFinch Checkout Adyen module](https://github.com/bluefinchcommerce/module-checkout-adyen)
which integrates with Magento_GraphQl and Adyen_Payment dependencies.

## CircleCi

CircleCi is a tool to allow for tests to be run on modules before they are deployed.

This module is configured to run with EsLint and PHPStan.

### Testing your module locally

You can test CircleCi before you push your code.

To do this you need to install circleci locally.

``` brew install circleci```

Then once this has been installed in the main directory of your package then.

```circleci local execute```
