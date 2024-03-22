import axios from 'axios';
import useCartStore from '@/stores/CartStore';

export default async (radius, lat, lng) => {
  const cartStore = useCartStore();
  const cartData = await cartStore.getCartData();
  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
  };

  const data = `lat=${lat}&lng=${lng}&radius=${Number(radius)}&product=0&category=0&sortByDistance=1`;

  return axios.post(`${cartData.store_pickup.map_data.ajax_call_url}`, data, { headers })
    .then((response) => JSON.parse(response.data));
};
