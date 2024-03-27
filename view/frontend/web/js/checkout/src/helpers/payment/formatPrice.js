import useConfigStore from '@/stores/ConfigStores/ConfigStore';

export default (price) => {
  const { currencyCode: currency = 'GBP' } = useConfigStore();

  let locale = 'en-UK';
  if (currency === 'USD') {
    locale = 'en-US';
  }

  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(price);
};
