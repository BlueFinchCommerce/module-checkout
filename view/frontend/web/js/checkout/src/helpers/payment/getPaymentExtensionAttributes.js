import useAgreementStore from '@/stores/ConfigStores/AgreementStore';

export default () => {
  const { agreementIds } = useAgreementStore();

  return {
    agreement_ids: agreementIds,
  };
};
