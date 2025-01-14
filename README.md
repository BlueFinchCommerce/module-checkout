![CircleCI](https://dl.circleci.com/status-badge/img/gh/bluefinchcommerce/module-checkout/tree/main.svg?style=svg&circle-token=244e88ea8c8c2c317e9fbe475efabdce9b01281e)

![BlueFinch Checkout](./assets/logo.svg)

## Description
The BlueFinch Checkout offers a robust suite of features tailored to enhance Adobe website checkouts, making it a preferred choice for businesses. Its Checkout Designer enables complete customization of colors, text, and styles directly within the admin interface, eliminating the need for development. With Instant Checkout, users can quickly transact using payment wallets like Apple Pay and Google Pay. The checkout is designed with UX best practices and streamlined with preselected delivery and payment options to minimize user touchpoints. It is also fast-loading, ensuring seamless and efficient transactions.

The BlueFinch Checkout incorporates validation features to guide users through form completion, provides an optional progress bar for improved navigation, and offers an enhanced order success page that includes a detailed order summary and the ability for guest users to create accounts effortlessly. Businesses can boost Average Order Value (AOV) with cross-sells displayed in the checkout, and granular insights are available through enhanced event tracking for GA4. Additionally, the checkout is easy to install, extend, and compatible with leading third-party services such as Braintree, PayPal Complete Payments, Loqate, and more, ensuring flexibility and scalability for diverse business needs.

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
    - [Local workflow](.github/CONTRIBUTING.md#local-workflow)
    - [Branching strategy](.github/CONTRIBUTING.md#branching-strategy)
    - [Making a release](.github/CONTRIBUTING.md#making-a-release)
- [Custom Extension Guide](docs/Extensions.md)

### BlueFinch Checkout extension modules

You can find our template for creating BlueFinch Checkout extension modules **[here](https://github.com/bluefinchcommerce/module-checkout-new-module-template)**.

## Default payment support

By default, BlueFinch Checkout includes support for Braintree payments.

If your site is using Adyen as the payment provider, you can install the [BlueFinch Checkout Adyen module](https://github.com/bluefinchcommerce/module-checkout-adyen)
which integrates with Magento_GraphQl and Adyen_Payment dependencies.

## CircleCi

CircleCi is a tool for us to use to allow for tested to be run on our modules before they are deployed.

This template comes with EsLint and PHPStan.

You can add more tests to this if you need to.


### Testing your module locally

You can test CircleCi before you push your code.

To do this you need to install circleci locally.

``` brew install circleci```

Then once this has been installed in the main directory of your package then.

```circleci local execute```