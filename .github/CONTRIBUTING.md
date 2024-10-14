# Branching strategy

The main branches are as follows

- `main` - The main branch
- `develop` - The develop branch

For feature work
- Branch off `develop`
- Merge to `develop`
- Wait for the github action to generate the `view/frontend/web/js/checkout/dist` directory for testing, test it.
- When the release candidate is ready it can be merged to `main`
- Wait for the github action to generate the `view/frontend/web/js/checkout/dist` directory for testing, test it.
- Tag `main` as the new version

For hotfixes to the current main tag
- Branch off of `main`
- Merge to `develop`
- Wait for the github action to generate the `view/frontend/web/js/checkout/dist` directory for testing, test it.
- When the release candidate is ready it can be merged to `main`
- Wait for the github action to generate the `view/frontend/web/js/checkout/dist` directory for testing, test it.
- Tag `main` as the new version

For hotfixes from an older tag
- Find the tag you need to hotfix
- Branch off of that tag 
- Call your branch `hotfix/abc123`
- Wait for the github action to generate the `view/frontend/web/js/checkout/dist` directory for testing, test it.
- At this point you will be able to have the flexibility to do what you need, either tagging a `-p1` off that tag or merging it into `main` etc

# Making a release

1. Get your release into `main`
1. Go to https://github.com/genecommerce/module-better-checkout/releases
1. "Draft a new release"
1. Choose your tag (https://semver.org/) 
1. Pick the target `main`
1. Hit "Generate Release Notes"
1. Tidy up the release notes as needed and "Publish release"

# Local workflow

Set 
- `gene_better_checkout/general/enable_local_developer_vite_watch_mode=1`
- `Gene -> Better Checkout -> General -> Enable local developer vite watch mode = yes`

When building the checkout locally you do not have the `dist-dev`, so you will have to 
```bash
cd view/frontend/web/js/checkout/
npm ci
npm run build-watch
```

This will populate `view/frontend/web/js/checkout/dist-dev` for use.

