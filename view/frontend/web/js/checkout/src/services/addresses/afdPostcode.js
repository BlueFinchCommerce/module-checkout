import axios from 'axios';
import retrieveUrl from '@/helpers/addresses/getAfdUrls';
import { handleError } from 'vue';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';
import graphQlRequest from '@/services/graphQlRequest';

export default {
  getAfdConfiguration() {
    const request = `{
      storeConfig {
        afd_general_account_type
        afd_general_account_serial_url
        afd_general_account_serial
        afd_general_account_password
        afd_general_account_id_url
        afd_general_account_id
        afd_general_account_token
        afd_response_max_quantity
      }
    }`;
    return graphQlRequest(request, {}, {}, 'BlueFinchCheckoutStoreConfigAfd')
      .then((response) => response.data.storeConfig);
  },

  getSuggestions(query, addressType) {
    const { countryCode, afd: { maxQuantity } } = useConfigStore();
    const { selected } = useCustomerStore();
    const afdCountry = selected[addressType]?.country_code || countryCode;

    const paramsObj = {
      format: 'json',
      intp: 'mag010603',
      intf: 'jqu011001',
      countryiso: `${afdCountry}`,
      data: 'address',
      fields: 'fflist',
      task: 'fastfindv4',
      lookup: `${query}`,
      allpc: '1',
      matchPositions: '1',
      maxquantity: maxQuantity,
      uniqueid: '89296&_=1664704178149',
    };

    const searchParams = new URLSearchParams(this.addCredentials(paramsObj));

    const requestUrl = `${retrieveUrl()}?${searchParams}`;

    return axios
      .get(requestUrl)
      .then((response) => response.data.Item)
      .catch(this.logResponseErrors);
  },

  logResponseErrors(error) {
    if (axios.isCancel(error)) console.log('AFD request cancelled');
  },

  getAndUseAddress(id, addressType) {
    const { countryCode } = useConfigStore();
    const { selected } = useCustomerStore();
    const afdCountry = selected[addressType]?.country_code || countryCode;

    const paramsObj = {
      format: 'json',
      intp: 'mag010603',
      intf: 'jqu011001',
      countryiso: `${afdCountry}`,
      key: `${id}`,
      data: 'address',
      fields: 'standard',
      task: 'retrieve',
    };

    const searchParams = new URLSearchParams(this.addCredentials(paramsObj));

    return axios
      .get(`${retrieveUrl()}?${searchParams}`)
      .then((response) => {
        if (typeof response.data.Item[0].Error !== 'string') {
          return response.data.Item[0];
        }
        return handleError({ error: { message: response.data.Item[0].Error } });
      });
  },

  addCredentials(params) {
    const { afd } = useConfigStore();

    const credentials = afd.type === 'id'
      ? {
        id: afd.id,
        token: afd.token,
      }
      : {
        serial: afd.serial,
        password: afd.password,
      };

    return Object.assign(params, credentials);
  },
};
