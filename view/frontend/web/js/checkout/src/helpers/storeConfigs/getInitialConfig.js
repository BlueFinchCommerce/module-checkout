import graphQlRequest from '@/services/graphQlRequest';

import useAdyenStore from '@/stores/PaymentStores/AdyenStore';
import useAgreementStore from '@/stores/ConfigStores/AgreementStore';
import useBraintreeStore from '@/stores/PaymentStores/BraintreeStore';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useRecaptchaStore from '@/stores/ConfigStores/RecaptchaStore';
import useValidationStore from '@/stores/ConfigStores/ValidationStore';

export default async () => {
  const adyenStore = useAdyenStore();
  const agreementStore = useAgreementStore();
  const braintreeStore = useBraintreeStore();
  const configStore = useConfigStore();
  const recaptchaStore = useRecaptchaStore();
  const validationStore = useValidationStore();

  const request = `{
    ${adyenStore.getInitialConfigValues()}
    ${agreementStore.getInitialConfigValues()}
    ${braintreeStore.getInitialConfigValues()}
    ${configStore.getInitialConfigValues()}
    ${recaptchaStore.getInitialConfigValues()}
    ${validationStore.getInitialConfigValues()}
  }`;

  const { data } = await graphQlRequest(request);

  return data;
};
