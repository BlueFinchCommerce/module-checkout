import useShippingMethodsStore from '@/stores/ShippingMethodsStore';

export default () => {
  const { selectedMethod, nominatedSelectedDate } = useShippingMethodsStore();

  const attributes = {};

  if (selectedMethod.method_code === 'nominated_delivery') {
    attributes.delivery_date = nominatedSelectedDate
      ? nominatedSelectedDate.toLocaleDateString('en-us')
      : false;
  }

  return attributes;
};
