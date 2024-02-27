import getCartSectionNames from '@/helpers/getCartSectionNames';
import getBasketPath from '@/helpers/getBasketPath';
import refreshCustomerData from '@/services/refreshCustomerData';

export default async () => {
  // Before we redirect them refresh the cart data so it's always correct when back on the Magento store.
  await refreshCustomerData(getCartSectionNames());
  window.location.replace(getBasketPath());
};
