import useConfigStore from '@/stores/ConfigStores/ConfigStore';

export default (price) => {
  const { currencyCode: currency = 'GBP' } = useConfigStore();
  return new Intl.NumberFormat('en-UK', { style: 'currency', currency }).format(price);
};
