import useConfigStore from '@/stores/ConfigStore';

export default () => {
  const { useStoreInUrl, storeCode } = useConfigStore();
  return useStoreInUrl
    ? `/${storeCode}/checkout/cart`
    : '/checkout/cart';
};
