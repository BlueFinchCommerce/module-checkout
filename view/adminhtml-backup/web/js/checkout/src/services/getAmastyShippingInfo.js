import axios from 'axios';
import getBaseRestUrl from '@/helpers/getBaseRestUrl';

export default () => {
  const url = `${getBaseRestUrl()}/amasty_shipbar/mine/bar/data`;
  const data = {
    customerGroup: 0,
    page: 'cart',
    position: [10],
  };
  return axios.post(url, data)
    .then((response) => response.data)
    .catch(() => (
      // If there's an error it means that Amasty isn't enabled so return an empty object.
      {}
    ));
};
