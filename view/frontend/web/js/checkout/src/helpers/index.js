import afterSubmittingShippingInformation from '@/helpers/addresses/afterSubmittingShippingInformation';
import beginCheckoutDataLayer from '@/helpers/dataLayer/beginCheckoutDataLayer';
import buildCartUrl from '@/helpers/cart/buildCartUrl';
import cleanAddress from '@/helpers/addresses/cleanAddress';
import continueAsGuestDataLayer from '@/helpers/dataLayer/continueAsGuestDataLayer';
import continueToDeliveryDataLayer from '@/helpers/dataLayer/continueToDeliveryDataLayer';
import createScriptLoadPromise from '@/helpers/createScriptLoadPromise';
import customerLoginDataLayer from '@/helpers/dataLayer/customerLoginDataLayer';
import deepClone from '@/helpers/addresses/deepClone';
import discountCodeDataLayer from '@/helpers/dataLayer/discountCodeDataLayer';
import doAddressesMatch from '@/helpers/addresses/doAddressesMatch';
import expressPaymentOnClick from '@/helpers/payment/expressPaymentOnClick';
import expressPaymentOnClickDataLayer from '@/helpers/dataLayer/expressPaymentOnClickDataLayer';
import formatAddress from '@/helpers/addresses/formatAddress';
import formatClickAndCollectAddress from '@/helpers/addresses/formatClickAndCollectAddress';
import formatPrice from '@/helpers/payment/formatPrice';
import getAdditionalPaymentData from '@/helpers/payment/getAdditionalPaymentData';
import getAfdUrls from '@/helpers/addresses/getAfdUrls';
import getBaseRestUrl from '@/helpers/storeConfigs/getBaseRestUrl';
import getBaseUrl from '@/helpers/storeConfigs/getBaseUrl';
import getBasketPath from '@/helpers/cart/getBasketPath';
import getCartItems from '@/helpers/cart/getCartItems';
import getCartSectionNames from '@/helpers/cart/getCartSectionNames';
import getCurrencyCode from '@/helpers/payment/getCurrencyCode';
import getCustomConfigs from '@/helpers/storeConfigs/getCustomConfigs';
import getEmptyAddress from '@/helpers/addresses/getEmptyAddress';
import getFallBackStaticPath from '@/helpers/storeConfigs/getFallBackStaticPath';
import getGeneralTermsServicesId from '@/helpers/content/getGeneralTermsServicesId';
import getLocale from '@/helpers/addresses/getLocale';
import * as getLoqateUrls from '@/helpers/addresses/getLoqateUrls';
import getLocalMaskedId from '@/helpers/cart/getLocalMaskedId';
import getPaymentExtensionAttributes from '@/helpers/payment/getPaymentExtensionAttributes';
import * as getPenniesUrl from '@/helpers/payment/getPenniesUrl';
import getPrivacyPolicyId from '@/helpers/content/getPrivacyPolicyId';
import getShippingExtensionAttributes from '@/helpers/shipping/getShippingExtensionAttributes';
import getStaticPath from '@/helpers/storeConfigs/getStaticPath';
import getStoreCode from '@/helpers/storeConfigs/getStoreCode';
import getStoreId from '@/helpers/storeConfigs/getStoreId';
import getSuccessPageUrl from '@/helpers/cart/getSuccessPageUrl';
import getTokenTypes from '@/helpers/tokens/getTokenTypes';
import getUrlQuery from '@/helpers/storeConfigs/getUrlQuery';
import getUrlTokens from '@/helpers/tokens/getUrlTokens';
import getWebsiteId from '@/helpers/storeConfigs/getWebsiteId';
import getWithdrawTermsServicesId from '@/helpers/content/getWithdrawTermsServicesId';
import giftCardCodeDataLayer from '@/helpers/dataLayer/giftCardCodeDataLayer';
import handleServiceError from '@/helpers/validation/handleServiceError';
import isEmailValid from '@/helpers/validation/isEmailValid';
import mapCustomConfigs from '@/helpers/storeConfigs/mapCustomConfigs';
import paymentCompleteDataLayer from '@/helpers/dataLayer/paymentCompleteDataLayer';
import paymentMethodSelectedDataLayer from '@/helpers/dataLayer/paymentMethodSelectedDataLayer';
import redirectToBasketPage from '@/helpers/cart/redirectToBasketPage';
import requestHokodoOffer from '@/helpers/payment/requestHokodoOffer';
import scrollToTarget from '@/helpers/scrollToTarget';
import selectAddressDataLayer from '@/helpers/dataLayer/selectAddressDataLayer';
import setShippingMethodDataLayer from '@/helpers/dataLayer/setShippingMethodDataLayer';

export default {
  afterSubmittingShippingInformation,
  beginCheckoutDataLayer,
  buildCartUrl,
  cleanAddress,
  continueAsGuestDataLayer,
  continueToDeliveryDataLayer,
  createScriptLoadPromise,
  customerLoginDataLayer,
  deepClone,
  discountCodeDataLayer,
  doAddressesMatch,
  expressPaymentOnClick,
  expressPaymentOnClickDataLayer,
  formatAddress,
  formatClickAndCollectAddress,
  formatPrice,
  getAdditionalPaymentData,
  getAfdUrls,
  getBaseRestUrl,
  getBaseUrl,
  getBasketPath,
  getCartItems,
  getCartSectionNames,
  getCurrencyCode,
  getCustomConfigs,
  getEmptyAddress,
  getFallBackStaticPath,
  getGeneralTermsServicesId,
  getLocale,
  getLoqateUrls,
  getLocalMaskedId,
  getPaymentExtensionAttributes,
  getPenniesUrl,
  getPrivacyPolicyId,
  getShippingExtensionAttributes,
  getStaticPath,
  getStoreCode,
  getStoreId,
  getSuccessPageUrl,
  getTokenTypes,
  getUrlQuery,
  getUrlTokens,
  getWebsiteId,
  getWithdrawTermsServicesId,
  giftCardCodeDataLayer,
  handleServiceError,
  isEmailValid,
  mapCustomConfigs,
  paymentCompleteDataLayer,
  paymentMethodSelectedDataLayer,
  redirectToBasketPage,
  requestHokodoOffer,
  scrollToTarget,
  selectAddressDataLayer,
  setShippingMethodDataLayer,
};
