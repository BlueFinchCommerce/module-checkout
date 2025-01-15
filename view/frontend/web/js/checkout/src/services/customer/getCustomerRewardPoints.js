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
  return graphQlRequest(request, {}, {}, 'BlueFinchCheckoutCustomerRewardPoints').then((response) => response.data);
};
