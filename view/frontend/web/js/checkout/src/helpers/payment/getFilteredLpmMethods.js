import useCustomerStore from '@/stores/CustomerStore';

export default (lpmMethods) => {
  const { selected: { billing } } = useCustomerStore();

  const methods = {
    bancontact: ['BE'],
    eps: ['AT'],
    giropay: ['DE'],
    ideal: ['NL'],
    sofort: ['AT', 'BE', 'DE', 'ES', 'IT', 'NL', 'GB'],
    mybank: ['IT'],
    p24: ['PL'],
    sepa: ['AT', 'DE'],
  };

  return lpmMethods.filter((method) => (
    methods[method]?.includes(billing?.country_code)
  ));
};
