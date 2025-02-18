![BlueFinch Checkout](../assets/logo.svg)

# BlueFinch Checkout - How to create a BlueFinch Checkout extension Magento module

Extension modules for the BlueFinch Checkout should be created according to [Magento standards](https://experienceleague.adobe.com/en/docs/commerce-learn/tutorials/backend-development/create-module).

We provide a BlueFinch Checkout [extension module template](https://github.com/BlueFinchCommerce/module-checkout-template) which includes all the necessary files you'll need to get started, that you can either clone as a starting point or use as a reference.

1. Clone the template into your `app/code` folder, using the standard Magento module folder naming `VendorName/ModuleName`.

    For example:

    ```
    cd app/code
    git clone https://github.com/BlueFinchCommerce/module-checkout-template.git MyCompany/MyModule
    ```

2. In `app/code/MyCompany/MyModule/registration.php` replace the module reference accordingly.

    For example, replace `BlueFinch_CheckoutNewModule` with `MyCompany_MyModule`.

3. In `app/code/MyCompany/MyModule/etc/module.xml` replace the module reference accordingly.

    For example, replace `<module name="BlueFinch_CheckoutNewModule">` with `<module name="MyCompany_MyModule">`.

4. In `app/code/MyCompany/MyModule/view/frontend/layout/bluefinchcheckout_checkout_index.xml` amend the new block name and template path to reflect your module template file.

    For example amend `<block name="bluefinch.checkout.new.module" template="BlueFinch_CheckoutNewModule::new-module.phtml" after="-">` to `<block name="mycompany.checkout.mymodule" template="MyCompany_CheckoutMyModule::new-module.phtml" after="-">`.

5. Rename the file `app/code/MyCompany/MyModule/view/frontend/templates/new-module.phtml` to match the new name now referenced in your layout file.

    For example rename the file to `my-module.phtml`.

6. In your modules phtml file `my-module.phtml`, amend the module reference `BlueFinch_CheckoutNewModule` in the frontend asset paths in the PHP variables.

    For example, amend `$styles = $assetViewModel->getDistViewFileUrl('BlueFinch_CheckoutNewModule::js/checkout/dist/styles.css');` to `$styles = $assetViewModel->getDistViewFileUrl('MyCompany_MyModule::js/checkout/dist/styles.css');`

7. Install and enable your new module within your environment `php bin/magento setup:upgrade` and clear any caches.

8. Navigate to the checkout on your site to see the two examples of extension points that our module template provides:
    1. Component extension point: A new component with the text "New Component - belowEmailFields" will be displayed below the email field on the first step of the checkout.
    2. Callback extension point: Open your browser inspector to see the text "New Component - onStepsCreated" logged in the console from the onStepsCreated event firing.
    
9. Make any necessary amendments in the following files in your new module to reflect your modules path and name:
    - `composer.json`
    - `package.json`
    - `README.md`
    - `.circleci/config.yml`
    - `view/frontend/web/js/checkout/package.json`

You're now ready to start extending the BlueFinch Checkout as you need to:

- [Component Extension Points](Extensions.md#component-extension-points) to choose where to place your new components.
- [Event Extension Points](Extensions.md#event-extension-points) to choose when you call your new callback functions.
- [GraphQL Query Mutations](Extensions.md#graphql-query-mutations) for when you need to amend the queries for checkout data.
- [How to change styling](Extensions.md#how-to-change-styling).
- Build your code, see [Local frontend development workflow](.github/CONTRIBUTING.md#local-frontend-development-workflow)

Refer to our [Custom extension guide](Extensions.md) for further information.