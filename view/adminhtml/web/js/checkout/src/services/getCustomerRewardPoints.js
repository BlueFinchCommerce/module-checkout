import graphQlRequest from './graphQlRequest';

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
  return graphQlRequest(request).then((response) => response.data);
};
