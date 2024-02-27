import graphQlRequest from './graphQlRequest';

export default (configs = []) => {
  const request = `{
    storeConfig {
      ${configs.join(' ')}
    }
  }`;
  return graphQlRequest(request).then((response) => response.data?.storeConfig);
};
