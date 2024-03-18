import axios from 'axios';
import useCartStore from '@/stores/CartStore';

export default async (postcode) => {
  const cartStore = useCartStore();
  const cartData = await cartStore.getCartData();
  const url = 'https://maps.googleapis.com/maps/api/geocode/json';

  return axios.get(`${url}?key=${cartData.store_pickup.map_data.api_key}&address=${postcode}`, {
    method: 'GET',
    cache: 'no-cache',
  }).then((response) => response.data.results);
};
