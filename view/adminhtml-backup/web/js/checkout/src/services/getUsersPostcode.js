import axios from 'axios';
import useConfigStore from '@/stores/ConfigStore';

export default () => (
  new Promise((resolve) => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      };

      const success = async (position) => {
        const { custom: { googleMapKey } } = useConfigStore();

        const { coords = {} } = position;
        const { latitude, longitude } = coords;

        const latLng = `${latitude},${longitude}`;
        const url = 'https://maps.googleapis.com/maps/api/geocode/json';
        const addressData = await axios.get(`${url}?key=${googleMapKey}&latlng=${encodeURIComponent(latLng)}`, {
          method: 'GET',
          cache: 'no-cache',
        }).then((response) => response.data);

        const { results = [] } = addressData;

        const postcode = results.reduce((prev, curr) => {
          if (prev) {
            return prev;
          }

          const { address_components: addressComponents = [] } = curr;
          return addressComponents.find((component) => (
            component.types.includes('postal_code') && component.short_name
          )).short_name;
        }, null);

        resolve(postcode);
      };

      const error = (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        resolve(null);
      };

      navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
      resolve(null);
    }
  })
);
