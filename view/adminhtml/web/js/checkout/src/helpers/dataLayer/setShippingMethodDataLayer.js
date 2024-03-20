import useCartStore from '@/stores/CartStore';
import useGtmStore from '@/stores/ConfigStores/GtmStore';

export default () => {
  const gtmStore = useGtmStore();
  const { cart } = useCartStore();
  const { selected_shipping_method: selctedMethod } = cart.shipping_addresses[0];

  gtmStore.trackGtmEvent({
    event: 'selectShippingMethod',
    carrierCode: selctedMethod.carrier_code,
    methodCode: selctedMethod.method_code,
  });
};
