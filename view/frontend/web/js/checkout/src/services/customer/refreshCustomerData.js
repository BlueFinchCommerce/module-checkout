import axios from 'axios';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

import setMageCacheStorage from '@/helpers/customer/setMageCacheStorage';
import setMageCookieSectionIds from '@/helpers/customer/setMageCookieSectionIds';

export default (sections = []) => {
  const { secureBaseUrl } = useConfigStore();

  const params = new URLSearchParams({
    sections,
    force_new_section_timestamp: false,
    _: new Date().getTime(),
  });
  const url = `${secureBaseUrl}customer/section/load/?${params.toString()}`;

  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
  };

  return axios.get(url, { headers })
    .then((response) => response.data)
    .then((data) => {
      setMageCacheStorage(data, sections);

      // If we have a new customer set the refresh date to the cookie too.
      if (sections.includes('customer')) {
        setMageCookieSectionIds('customer', data.customer.data_id);
      }
    });
};
