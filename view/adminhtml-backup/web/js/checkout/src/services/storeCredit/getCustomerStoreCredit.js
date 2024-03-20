import graphQlRequest from '@/services/graphQlRequest';

export default () => {
  const request = `{
    customer {
      store_credit {
        enabled
        current_balance {
          value
          currency
        }
      }
    }
  }`;
  return graphQlRequest(request).then((response) => response.data);
};
