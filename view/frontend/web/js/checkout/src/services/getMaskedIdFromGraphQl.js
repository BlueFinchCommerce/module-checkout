import graphQlRequest from '@/services/graphQlRequest';

export default () => {
  const request = `{
    customerCart {
      id
    }
  }`;
  return graphQlRequest(request).then((response) => response.data.customerCart.id);
};
