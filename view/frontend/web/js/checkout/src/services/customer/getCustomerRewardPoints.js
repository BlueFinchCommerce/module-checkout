import graphQlRequest from '@/services/graphQlRequest';

export default () => {
  const request = `{
    customer {
      reward_points {
        balance {
          points
          money {
            value
            currency
          }
        }
      }
    }
  }`;
  return graphQlRequest(request, {}, {}, 'BetterCheckoutCustomer').then((response) => response.data);
};
