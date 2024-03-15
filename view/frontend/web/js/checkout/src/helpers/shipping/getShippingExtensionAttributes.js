import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

export default () => {
  const { selectedMethod, nominatedSelectedDate, amastyClickAndCollectData } = useShippingMethodsStore();

  const attributes = {};

  if (selectedMethod.method_code === 'nominated_delivery') {
    attributes.delivery_date = nominatedSelectedDate
      ? nominatedSelectedDate.toLocaleDateString('en-us')
      : false;
  }

  if (selectedMethod.method_code === 'amstorepickup') {
    attributes.am_pickup = amastyClickAndCollectData;
  }

  return attributes;
};
