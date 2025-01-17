import graphQlRequest from '@/services/graphQlRequest';

export default () => {
  const request = `{
    customerCart {
      id
    }
  }`;
  return graphQlRequest(request, {}, {}, 'BetterCheckoutCartId')
    .then((response) => response.data?.customerCart?.id ?? null);
};
