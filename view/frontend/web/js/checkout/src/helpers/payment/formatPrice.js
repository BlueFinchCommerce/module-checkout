import useConfigStore from '@/stores/ConfigStores/ConfigStore';

export default (price) => {
  const { currencyCode: currency = 'GBP', locale } = useConfigStore();

  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(price);
};
