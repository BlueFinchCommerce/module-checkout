import useAgreementStore from '@/stores/ConfigStores/AgreementStore';
import useBraintreeStore from '@/stores/PaymentStores/BraintreeStore';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import useGtmStore from '@/stores/ConfigStores/GtmStore';
import useHokodoStore from '@/stores/PaymentStores/HokodoStore';
import useLoadingStore from '@/stores/LoadingStore';
import usePaymentStore from '@/stores/PaymentStores/PaymentStore';
import useRecaptchaStore from '@/stores/ConfigStores/RecaptchaStore';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';
import useStepsStore from '@/stores/StepsStore';
import useValidationStore from '@/stores/ConfigStores/ValidationStore';

export default {
  useAgreementStore,
  useBraintreeStore,
  useCartStore,
  useConfigStore,
  useCustomerStore,
  useGtmStore,
  useHokodoStore,
  useLoadingStore,
  usePaymentStore,
  useRecaptchaStore,
  useShippingMethodsStore,
  useStepsStore,
  useValidationStore,
};
