import useConfigStore from '@/stores/ConfigStore';

export default (price) => {
  const { currencyCode: currency = 'GBP' } = useConfigStore();
  return new Intl.NumberFormat('en-UK', { style: 'currency', currency }).format(price);
};
