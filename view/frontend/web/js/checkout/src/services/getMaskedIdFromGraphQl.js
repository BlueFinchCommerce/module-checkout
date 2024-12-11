import graphQlRequest from '@/services/graphQlRequest';

export default () => {
  const request = `{
    customerCart {
      id
    }
  }`;
  return graphQlRequest(request, {}, {}, 'BetterCheckoutCart')
    .then((response) => response.data?.customerCart?.id ?? null);
};
