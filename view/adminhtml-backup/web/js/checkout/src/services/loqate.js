import axios from 'axios';
import { findUrl, retrieveUrl } from '@/helpers/getLoqateUrls';
import { handleError } from 'vue';
import useConfigStore from '@/stores/ConfigStore';
import useCustomerStore from '@/stores/CustomerStore';

let request = null;

export default {
  cancel() {
    request.cancel();
    this.clearOldRequest();
  },
  clearOldRequest() {
    request = null;
  },
  getSuggestions(containerQuery, query, addressType) {
    const { countryCode, addressFinder: { loqate } } = useConfigStore();
    const { selected } = useCustomerStore();
    // If there's request still awaiting a response then kill it:
    if (request) this.cancel();
    // Setup new cancelTokens so we can cancel this request if another is triggered
    const axiosSource = axios.CancelToken.source();
    request = { cancel: axiosSource.cancel, msg: 'Loading...' };
    // Create url for get request
    const container = typeof containerQuery === 'string' ? `&Container=${containerQuery}` : '';
    const loqateCountry = selected[addressType]?.country_id || countryCode;
    const requestUrl = `${findUrl
    }?key=${
      loqate.apiKey
    }&Countries=${
      loqateCountry
    }&Limit=10&Text=${
      query
    }${container}`;

    return axios
      .get(requestUrl, { cancelToken: axiosSource.token })
      .then((response) => {
        this.clearOldRequest();
        return response.data.Items;
      })
      .catch(this.logResponseErrors);
  },
  logResponseErrors(error) {
    if (axios.isCancel(error)) console.log('Loqate request cancelled');
  },
  getAndUseAddress(id) {
    const { addressFinder: { loqate } } = useConfigStore();
    return axios
      .get(`${retrieveUrl}?key=${loqate.apiKey}&Id=${id}`)
      .then((response) => {
        if (typeof response.data.Items[0].Error !== 'string') {
          return response.data.Items[0];
        }
        return handleError({ error: { message: response.data.Items[0].Error } });
      });
  },
};
