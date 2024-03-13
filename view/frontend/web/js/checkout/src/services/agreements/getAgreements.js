import graphQlRequest from '@/services/graphQlRequest';

export default () => {
  const request = `{
    checkoutAgreements {
      agreement_id
      name
      content
      checkbox_text
      mode
    }
  }`;

  return graphQlRequest(request)
    .then((response) => response.data.checkoutAgreements);
};
