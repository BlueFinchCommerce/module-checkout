import addCartItem from '@/services/cart/addCartItem';
import addDiscountCode from '@/services/discount/addDiscountCode';
import addGiftCardCode from '@/services/giftCard/addGiftCardCode';
import afdPostcode from '@/services/addresses/afdPostcode';
import authenticatedRequest from '@/services/authenticatedRequest';
import beforePaymentRequest from '@/services/payments/beforePaymentRequest';
import createClientToken from '@/services/braintree/createClientToken';
import createPaymentGraphQl from '@/services/payments/createPaymentGraphQl';
import createPaymentRest from '@/services/payments/createPaymentRest';
import getBlock from '@/services/content/getBlock';
import getCart from '@/services/cart/getCart';
import getCartData from '@/services/cart/getCartData';
import getCrosssells from '@/services/cart/getCrosssells';
import getCustomerInformation from '@/services/customer/getCustomerInformation';
import getCustomerRewardPoints from '@/services/customer/getCustomerRewardPoints';
import getMaskedIdFromGraphQl from '@/services/getMaskedIdFromGraphQl';
import getNewsletterMutation from '@/services/newsletter/getNewsletterMutation';
import getPaymentNonce from '@/services/braintree/getPaymentNonce';
import getQuote from '@/services/getQuote';
import getShippingMethods from '@/services/addresses/getShippingMethods';
import getStoreCode from '@/services/getStoreCode';
import getStoreConfig from '@/services/getStoreConfig';
import getVaultedMethods from '@/services/braintree/getVaultedMethods';
import graphQlRequest from '@/services/graphQlRequest';
import isEmailAvailable from '@/services/customer/isEmailAvailable';
import login from '@/services/customer/login';
import loqate from '@/services/addresses/loqate';
import mergeGuestCart from '@/services/cart/mergeGuestCart';
import penniesCharityBox from '@/services/payments/penniesCharityBox';
import refreshCustomerData from '@/services/customer/refreshCustomerData';
import removeCartItem from '@/services/cart/removeCartItem';
import removeDiscountCode from '@/services/discount/removeDiscountCode';
import removeGiftCardCode from '@/services/giftCard/removeGiftCardCode';
import removeRewardPoints from '@/services/reward/removeRewardPoints';
import removeStoreCredit from '@/services/storeCredit/removeStoreCredit';
import setAddressesOnCart from '@/services/addresses/setAddressesOnCart';
import setGuestEmailOnCart from '@/services/cart/setGuestEmailOnCart';
import setShippingMethodOnCart from '@/services/addresses/setShippingMethodOnCart';
import updateCartItemQuantity from '@/services/cart/updateCartItemQuantity';
import updatePayment from '@/services/braintree/updatePayment';
import useRewardPoints from '@/services/reward/useRewardPoints';

export default {
  addCartItem,
  addDiscountCode,
  addGiftCardCode,
  afdPostcode,
  authenticatedRequest,
  beforePaymentRequest,
  createClientToken,
  createPaymentGraphQl,
  createPaymentRest,
  getBlock,
  getCart,
  getCartData,
  getCrosssells,
  getCustomerInformation,
  getCustomerRewardPoints,
  getMaskedIdFromGraphQl,
  getNewsletterMutation,
  getPaymentNonce,
  getQuote,
  getShippingMethods,
  getStoreCode,
  getStoreConfig,
  getVaultedMethods,
  graphQlRequest,
  isEmailAvailable,
  login,
  loqate,
  mergeGuestCart,
  penniesCharityBox,
  refreshCustomerData,
  removeCartItem,
  removeDiscountCode,
  removeGiftCardCode,
  removeRewardPoints,
  removeStoreCredit,
  setAddressesOnCart,
  setGuestEmailOnCart,
  setShippingMethodOnCart,
  updateCartItemQuantity,
  updatePayment,
  useRewardPoints,
};
