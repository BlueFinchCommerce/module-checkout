import axios from 'axios';
import { addCharityUrl, removeCharityUrl } from '@/helpers/getPenniesUrl';
import useConfigStore from '@/stores/ConfigStore';
import getStoreId from '@/helpers/getStoreId';
import graphQlRequest from './graphQlRequest';

export default {
  getPenniesConfigs() {
    const storeId = getStoreId();
    const request = `{
           PenniesData(store_id: "${storeId}") {
                charity_logo_url,
                enabled
           }
        }`;
    return graphQlRequest(request).then((response) => response.data);
  },
  getCharityAmount() {
    const storeId = parseInt(getStoreId(), 10);

    const request = `{
           PenniesCalculate( store_id : ${storeId} ){
                amount
                charity_id
                currency
                soundbite
                message
           }
        }`;
    return graphQlRequest(request).then((response) => response.data.PenniesCalculate);
  },

  logResponseErrors(error) {
    if (axios.isCancel(error)) console.log('Pennies request cancelled');
  },

  addCharityAmount() {
    const { secureBaseUrl } = useConfigStore();

    const requestUrl = `${secureBaseUrl}${addCharityUrl}`;

    return axios
      .get(requestUrl)
      .then((response) => response.data.success)
      .catch(this.logResponseErrors);
  },

  removeCharityAmount() {
    const { secureBaseUrl } = useConfigStore();

    const requestUrl = `${secureBaseUrl}${removeCharityUrl}`;

    return axios
      .get(requestUrl)
      .then((response) => response.data.success)
      .catch(this.logResponseErrors);
  },
};
