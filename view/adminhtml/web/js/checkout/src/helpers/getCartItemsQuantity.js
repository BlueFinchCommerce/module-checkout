import getCartItems from '@/helpers/dummyContent/getDummyCartItems';

export default () => {
  const cartItems = getCartItems();

  return Object.values(cartItems).reduce((prev, curr) => (
    prev + curr.qty
  ), 0);
};
