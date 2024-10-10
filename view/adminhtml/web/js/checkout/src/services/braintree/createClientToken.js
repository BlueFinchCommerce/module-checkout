import graphQlRequest from '@/services/graphQlRequest';

export default () => {
  const request = `
    mutation {
      createBraintreeClientToken
    }`;
  return graphQlRequest(request);
};
