import axios from 'axios';
import useConfigStore from '@/stores/ConfigStores/ConfigStore';

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
      const mageCache = JSON.parse(localStorage.getItem('mage-cache-storage'));
      sections.forEach((section) => {
        mageCache[section] = data[section];
      });
      localStorage.setItem('mage-cache-storage', JSON.stringify(mageCache));
    });
};
