# Local workflow

When building the checkout locally you will have to 
```bash
cd view/frontend/web/js/checkout/
npm ci
npm run build
```

This will populate `view/frontend/web/js/checkout/dist` for use.

You can make your changes and re-run `npm run build` to check them.

When your PR gets merged to `develop` or `main` it will automatically have the `dist` generated.