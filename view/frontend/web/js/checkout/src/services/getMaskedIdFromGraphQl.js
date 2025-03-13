import graphQlRequest from '@/services/graphQlRequest';

export default () => {
  const request = `{
    customerCart {
      id
    }
  }`;
  return graphQlRequest(request, {}, {}, 'BlueFinchCheckoutCartId')
    .then((response) => response.data?.customerCart?.id ?? null);
};
