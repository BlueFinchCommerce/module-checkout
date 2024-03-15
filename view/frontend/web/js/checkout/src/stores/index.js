import useAdyenStore from '@/stores/PaymentStores/AdyenStore';
import useBraintreeStore from '@/stores/PaymentStores/BraintreeStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import useGtmStore from '@/stores/ConfigStores/GtmStore';
import useHokodoStore from '@/stores/PaymentStores/HokodoStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';
import useStepsStore from '@/stores/StepsStore';

export default {
  useAdyenStore,
  useBraintreeStore,
  useCartStore,
  useConfigStore,
  useCustomerStore,
  useGtmStore,
  useHokodoStore,
  usePaymentStore,
  useShippingMethodsStore,
  useStepsStore,
};
