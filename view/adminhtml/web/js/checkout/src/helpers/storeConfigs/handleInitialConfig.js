import useAgreementStore from '@/stores/ConfigStores/AgreementStore';
import useBraintreeStore from '@/stores/PaymentStores/BraintreeStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useRecaptchaStore from '@/stores/ConfigStores/RecaptchaStore';

export default async (data) => {
  const agreementStore = useAgreementStore();
  const braintreeStore = useBraintreeStore();
  const configStore = useConfigStore();
  const recaptchaStore = useRecaptchaStore();

  agreementStore.handleInitialConfig(data);
  braintreeStore.handleInitialConfig(data);
  configStore.handleInitialConfig(data);
  recaptchaStore.handleInitialConfig(data);
};
