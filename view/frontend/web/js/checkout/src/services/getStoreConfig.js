import graphQlRequest from './graphQlRequest';

export default (configs = []) => {
  const request = `{
    storeConfig {
      ${configs.join(' ')}
    }
  }`;
  return graphQlRequest(request, {}, {}, 'BetterCheckoutStoreConfig').then((response) => response.data?.storeConfig);
};
