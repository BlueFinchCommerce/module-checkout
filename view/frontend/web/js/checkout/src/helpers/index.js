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
import formatPrice from '@/helpers/payment/formatPrice';
import getAdditionalPaymentData from '@/helpers/payment/getAdditionalPaymentData';
import getAfdUrls from '@/helpers/addresses/getAfdUrls';
import getAppliedCoupons from '@/helpers/cart/queryData/getAppliedCoupons';
import getAppliedStoreCredit from '@/helpers/cart/queryData/getAppliedStoreCredit';
import getBaseRestUrl from '@/helpers/storeConfigs/getBaseRestUrl';
import getBaseUrl from '@/helpers/storeConfigs/getBaseUrl';
import getBasketPath from '@/helpers/cart/getBasketPath';
import getBillingAddress from '@/helpers/cart/queryData/getBillingAddress';
import getBraintreeCcTypes from '@/helpers/payment/getBraintreeCcTypes';
import getCartItems from '@/helpers/cart/getCartItems';
import getCartPaymentMethods from '@/helpers/cart/getCartPaymentMethods';
import getCartPrices from '@/helpers/cart/getCartPrices';
import getCartSectionNames from '@/helpers/cart/getCartSectionNames';
import getCurrencyCode from '@/helpers/payment/getCurrencyCode';
import getCustomConfigs from '@/helpers/storeConfigs/getCustomConfigs';
import getEmailField from '@/helpers/cart/queryData/getEmailField';
import getEmptyAddress from '@/helpers/addresses/getEmptyAddress';
import getFallBackStaticPath from '@/helpers/storeConfigs/getFallBackStaticPath';
import getFullCart from '@/helpers/cart/queryData/getFullCart';
import getGeneralTermsServicesId from '@/helpers/content/getGeneralTermsServicesId';
import getGiftCards from '@/helpers/cart/queryData/getGiftCards';
import getGiftWrapping from '@/helpers/cart/queryData/getGiftWrapping';
import getInitialConfig from '@/helpers/storeConfigs/getInitialConfig';
import getIsVirtual from '@/helpers/cart/queryData/getIsVirtual';
import getIsVirtualCart from '@/helpers/cart/getIsVirtual';
import getItems from '@/helpers/cart/queryData/getItems';
import getLocale from '@/helpers/addresses/getLocale';
import * as getLoqateUrls from '@/helpers/addresses/getLoqateUrls';
import getLocalMaskedId from '@/helpers/cart/getLocalMaskedId';
import getPaymentExtensionAttributes from '@/helpers/payment/getPaymentExtensionAttributes';
import getPaymentMethods from '@/helpers/cart/queryData/getPaymentMethods';
import * as getPenniesUrl from '@/helpers/payment/getPenniesUrl';
import getPrices from '@/helpers/cart/queryData/getPrices';
import getPrivacyPolicyId from '@/helpers/content/getPrivacyPolicyId';
import getRecaptchaTypes from '@/helpers/types/getRecaptchaTypes';
import getRewardPoints from '@/helpers/cart/queryData/getRewardPoints';
import getShippingAddresses from '@/helpers/cart/queryData/getShippingAddresses';
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
import handleInitialConfig from '@/helpers/storeConfigs/handleInitialConfig';
import handleServiceError from '@/helpers/validation/handleServiceError';
import inputTypeValid from '@/helpers/validation/inputTypeValid';
import isEmailValid from '@/helpers/validation/isEmailValid';
import loadFromCheckout from "@/helpers/extensionData/loadFromCheckout";
import mapCustomConfigs from '@/helpers/storeConfigs/mapCustomConfigs';
import maxLength from '@/helpers/validation/maxLength';
import minLength from '@/helpers/validation/minLength';
import paymentCompleteDataLayer from '@/helpers/dataLayer/paymentCompleteDataLayer';
import paymentMethodSelectedDataLayer from '@/helpers/dataLayer/paymentMethodSelectedDataLayer';
import redirectToBasketPage from '@/helpers/cart/redirectToBasketPage';
import requiredValid from '@/helpers/validation/requiredValid';
import sanitiseInputValue from '@/helpers/addresses/sanitiseInputValue';
import scrollToTarget from '@/helpers/scrollToTarget';
import selectAddressDataLayer from '@/helpers/dataLayer/selectAddressDataLayer';
import setMageCacheStorage from '@/helpers/customer/setMageCacheStorage';
import setMageCookieSectionIds from '@/helpers/customer/setMageCookieSectionIds';
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
  formatPrice,
  getAdditionalPaymentData,
  getAfdUrls,
  getAppliedCoupons,
  getAppliedStoreCredit,
  getBaseRestUrl,
  getBaseUrl,
  getBasketPath,
  getBillingAddress,
  getBraintreeCcTypes,
  getCartItems,
  getCartPaymentMethods,
  getCartPrices,
  getCartSectionNames,
  getCurrencyCode,
  getCustomConfigs,
  getEmailField,
  getEmptyAddress,
  getFallBackStaticPath,
  getFullCart,
  getGeneralTermsServicesId,
  getGiftCards,
  getGiftWrapping,
  getInitialConfig,
  getIsVirtual,
  getIsVirtualCart,
  getItems,
  getLocale,
  getLoqateUrls,
  getLocalMaskedId,
  getPaymentExtensionAttributes,
  getPaymentMethods,
  getPenniesUrl,
  getPrices,
  getPrivacyPolicyId,
  getRecaptchaTypes,
  getRewardPoints,
  getShippingAddresses,
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
  handleInitialConfig,
  handleServiceError,
  inputTypeValid,
  isEmailValid,
  loadFromCheckout,
  mapCustomConfigs,
  maxLength,
  minLength,
  paymentCompleteDataLayer,
  paymentMethodSelectedDataLayer,
  redirectToBasketPage,
  requiredValid,
  sanitiseInputValue,
  scrollToTarget,
  selectAddressDataLayer,
  setMageCacheStorage,
  setMageCookieSectionIds,
  setShippingMethodDataLayer,
};
