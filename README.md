![CircleCI](https://dl.circleci.com/status-badge/img/gh/genecommerce/module-better-checkout/tree/main.svg?style=svg&circle-token=244e88ea8c8c2c317e9fbe475efabdce9b01281e)

![Better Checkout Powered by GENE](./assets/logo.svg)

## Requirements

- Magento 2.4.6 or higher
- Node 16 or higher (for development purposes only)

## Installation

To install the Better Checkout module, run the following command in your Magento 2 root directory:

``` composer require gene/module-better-checkout:^1.0 ```

Better Checkout follows the standard installation process for Adobe Commerce.

For information about a module installation in Adobe Commerce, see [Enable or disable modules](https://experienceleague.adobe.com/en/docs/commerce-operations/installation-guide/tutorials/manage-modules).

To enable the Better Checkout on your store, log into the Magento admin area, then:

Stores > Configuration (Select your store if multi store) > Gene > Better Checkout > General - Enable Module: Yes

Remember to clear any appropriate caches.

## Documentation

- [Contributing](.github/CONTRIBUTING.md)
    - [Local workflow](.github/CONTRIBUTING.md#local-workflow)
    - [Branching strategy](.github/CONTRIBUTING.md#branching-strategy)
    - [Making a release](.github/CONTRIBUTING.md#making-a-release)
- [Custom Extension Guide](docs/Extensions.md)

### Better Checkout extension modules

You can find our template for creating Better Checkout extension modules **[here](https://github.com/genecommerce/better-checkout-new-module-template)**.

## Default payment support

By default, Better Checkout includes support for Braintree payments.

If your site is using Adyen as the payment provider, you can install the [Better Checkout Adyen module](https://github.com/genecommerce/module-better-checkout-adyen)
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