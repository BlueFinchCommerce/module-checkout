import getCartSectionNames from '@/helpers/cart/getCartSectionNames';
import getBasketPath from '@/helpers/cart/getBasketPath';
import refreshCustomerData from '@/services/customer/refreshCustomerData';

export default async () => {
  // Before we redirect them refresh the cart data so it's always correct when back on the Magento store.
  debugger;
  await refreshCustomerData(getCartSectionNames());
  window.location.replace(getBasketPath());
};
