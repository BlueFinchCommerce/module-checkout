import graphQlRequest from '@/services/graphQlRequest';
import createScriptLoadPromise from '@/helpers/createScriptLoadPromise';

export default {
  getHokodoConfigs() {
    const request = `{
      storeConfig {
        hokodo_enabled
        hokodo_sdk_countries
        hokodo_title
        hokodo_api_url
        hokodo_sdk_key
        hokodo_sdk_url
        hokodo_logo_CC
        hokodo_logo_DD
        hokodo_show_logo
        hokodo_subtitle
        hokodo_more_info
      },
    }`;
    return graphQlRequest(request, {}, {}, 'BlueFinchCheckoutStoreConfigHokodo').then((response) => response.data);
  },

  getHokodoCompanyId() {
    const request = `{
      hokodoUser
    }`;
    return graphQlRequest(request, {}, {}, 'BlueFinchCheckoutHokodoUser').then((response) => response.data);
  },

  getHokodoScripts(url) {
    return createScriptLoadPromise(url);
  },
};
