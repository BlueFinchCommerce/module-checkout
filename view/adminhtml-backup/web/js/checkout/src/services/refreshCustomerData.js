import axios from 'axios';
import useConfigStore from '@/stores/ConfigStore';

export default (sections = []) => {
  const { secureBaseUrl } = useConfigStore();

  const params = new URLSearchParams({
    sections,
    force_new_section_timestamp: false,
    _: new Date().getTime(),
  });
  const url = `${secureBaseUrl}customer/section/load/?${params.toString()}`;

  return axios.get(url)
    .then((response) => response.data)
    .then((data) => {
      const mageCache = JSON.parse(localStorage.getItem('mage-cache-storage'));
      sections.forEach((section) => {
        mageCache[section] = data[section];
      });
      localStorage.setItem('mage-cache-storage', JSON.stringify(mageCache));
    });
};
