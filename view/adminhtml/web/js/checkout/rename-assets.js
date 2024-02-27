// Variables
const themePath = 'adminhtml/Magento/spectrum/en_US/Gene_BetterCheckout/js/checkout/dist/';

// Do not edit below this line.
const { promises: fsPromises } = require('fs');

const getFilePath = (filename) => (
  `./dist/${filename}`
);

const loadFile = (filename) => (
  fsPromises.readFile(getFilePath(filename), 'utf-8')
);

async function replaceAssetNames() {
  const manifest = await loadFile('manifest.json');
  const { 'main.js': { file, assets } } = JSON.parse(manifest);
  let main = await loadFile(file);

  assets.forEach((asset) => {
    main = main.replace(new RegExp(asset, 'gm'), `${themePath}${asset}`);
  });

  await fsPromises.writeFile(getFilePath(file), main);
}

replaceAssetNames();
