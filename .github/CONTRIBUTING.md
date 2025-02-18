![BlueFinch Checkout](../assets/logo.svg)

# BlueFinch Checkout - Contributing

## Contributors

We want to make contributing to the BlueFinch Checkout as easy and transparent as possible. We actively welcome your pull requests or any reported issues (We use GitHub issues to track public bugs. Please ensure your description is clear and has sufficient instructions to be able to reproduce the issue.).

As a contributor, you are able to:
- Submit pull requests with code changes, bug fixes, or new features
- Create issues to report bugs or suggest enhancements
- Comment on issues and pull requests
- Fork the repository to your own GitHub account
- Submit documentation updates
- Review pull requests

## Maintainers (Admin or collaborator with write access)

Maintainers, amongst other things, are able to:
- Merge or reject pull requests
- Push directly to protected branches
- Delete or edit any issues
- Manage repository settings
- Configure branch protection rules
- Manage access permissions for other users
- Configure webhooks and integrations
- Create and manage project releases
- Edit repository metadata and description
- Close or reopen any issues or pull requests
- Modify repository visibility settings
- Add or remove other maintainers (if they have admin rights)

## Local frontend development workflow

Within the frontend checkout Vue app we use [Vite](https://vite.dev/) to compile the frontend assets (JavaScript, styles, svg's etc) for production distribution into a `dist` directory (`view/frontend/web/js/checkout/dist` or `view/adminhtml/web/js/checkout/dist` for the admin designer) that are then referenced in the modules phtml file and loaded in by the page in the site.

If any of these assets are amended, the automated generation of these is triggered on merge into `develop*`, `hotfix/*` or `main` branches by a [ GitHub action](.github/workflows/generate-dist.yml)

**When working locally to develop the checkout app, it is best to use the `watch` functionality.**

To do this you will need to:
1. Turn on support for vite watch in the admin panel or by using magerun:
    - `Stores - Configuration -> BlueFinch -> Checkout -> General -> Enable local developer vite watch mode = yes`
    - `n98-magerun config:store:set bluefinchcommerce_checkout/general/enable_local_developer_vite_watch_mode=1`

2. Install the node modules in the checkout app and run build-watch:
    ```bash
    cd view/frontend/web/js/checkout/ # or view/adminhtml/web/js/checkout/
    npm ci
    npm run build-watch
    ```

This will populate `view/frontend/web/js/checkout/dist-dev` for use, allowing you to make changes and have them quickly visible on the frontend.

Please note, the `dist-dev` directory is git ignored, so your locally generated files will not be committed, but as previously stated above the GitHub action will automatically generate them on merge.

## Branching strategy

The main branches are as follows:

- `main` - The main branch
- `develop` - The develop branch

For feature work:
- Branch off `develop`, naming your branch `feature/my-feature-branch-name`.
    - Complete and commit your changes to your feature branch.
    - Raise a PR for your feature branch against `develop` for approval.
- Once approved, merge your feature branch in to `develop`.
    - Wait for the GitHub action to generate the `view/frontend/web/js/checkout/dist` directory before updating any environment for testing.
- When the release candidate is ready it can be merged to `main`.
    - Wait for the GitHub action to generate the `view/frontend/web/js/checkout/dist` directory before the final step:
- [Create a new release and tag](#creating-a-release-and-tag) from `main` as the new version.

For hotfixes to the current main tag:
- Branch off `main`, naming your branch `hotfix/my-hotfix-branch-name`.
    - Complete and commit your changes to your hotfix branch.
    - Raise a PR for your hotfix branch against `develop` for approval, if you have conflicts on the dist files accept either version, they will be re-generated.
- Once approved, merge your hotfix branch in to `develop`.
    - Wait for the GitHub action to generate the `view/frontend/web/js/checkout/dist` directory before updating any environment for testing.
- When the release candidate is ready it can be merged to `main`.
    - Wait for the GitHub action to generate the `view/frontend/web/js/checkout/dist` directory before the final step:
- [Create a new release and tag](#creating-a-release-and-tag) from `main` as the new version.

For hotfixes from an older tag:
- Find the tag you need to hotfix and branch off that tag, naming your branch `hotfix/my-hotfix-branch-name`.
    - Complete and commit your changes to your hotfix branch.
    - Wait for the GitHub action to generate the `view/frontend/web/js/checkout/dist` directory before updating any environment for testing.
- At this point you will be able to have the flexibility to do what you need, either tagging a `-p1` off that tag or merging it into `main` etc

## Manual module version update for display in Admin

For greater visibility we display the BlueFinch Checkout module version installed on an environment at the top of the configuration panel in the admin area at `Stores - Configuration -> BlueFinch -> Checkout`.

This value comes from [etc/adminhtml/system.xml](../etc/adminhtml/system.xml) and needs a manual code change of the text `Version: x.x.x` shown below, for every release:
```
<group id="general" translate="label comment" type="text" sortOrder="10" showInDefault="1" showInWebsite="1" showInStore="1">
    <comment>
        <![CDATA[Version: x.x.x<br>BlueFinch Checkout Provided By <a href="http://bluefinchcommerce.com/" target="_blank">BlueFinch Commerce</a>]]>
    </comment>
</group>
```

## Creating a release and tag

1. Once all the work for the next release has been QA tested, approved for release and merged into `main`:
    - **Ensure the [module version for display in admin has been updated](#manual-module-version-update-for-display-in-Admin) in 'main' and if not raise a PR for approval and merging to do so, before continuing.**
1. Go to https://github.com/bluefinchcommerce/module-checkout/releases
1. Click on the "Draft a new release" button towards the top of the releases section of the page.
1. Choose your tag (https://semver.org/)
    -  This will more often than not be entering the next tag version manually and then clicking on the "+ Create a new tag: x.x.x on publish" option below the tag field.
1. Pick the target `main`
1. Hit "Generate Release Notes"
1. If you need to at any point you can "Save draft" to be able to return to publishing the release at a later date.
1. Tidy up the release notes as needed and then click the "Publish release".

### Versioning

We use Semantic Versioning to release our packages:

- **Major** - A version where incompatible change has been made to the module meaning it will not longer work with existing versions.
- **Minor** - A version where you have added additional functionailty in a backwards compatible manner.
- **Patch** - A version where you make backwards compatible bug fixes.

For more information about Semantic Versioning see **[here](https://semver.org/)**.
