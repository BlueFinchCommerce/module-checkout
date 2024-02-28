import afterSubmittingShippingInformation from '@/helpers/afterSubmittingShippingInformation';
import buildCartUrl from '@/helpers/buildCartUrl';
import cleanAddress from '@/helpers/cleanAddress';
import createScriptLoadPromise from '@/helpers/createScriptLoadPromise';
import deepClone from '@/helpers/deepClone';
import doAddressesMatch from '@/helpers/doAddressesMatch';
import expressPaymentOnClick from '@/helpers/expressPaymentOnClick';
import formatAddress from '@/helpers/formatAddress';
import formatClickAndCollectAddress from '@/helpers/formatClickAndCollectAddress';
import formatPrice from '@/helpers/formatPrice';
import getAdditionalPaymentData from '@/helpers/getAdditionalPaymentData';
import getAdyenProductionMode from '@/helpers/getAdyenProductionMode';
import getAfdUrls from '@/helpers/getAfdUrls';
import getBaseRestUrl from '@/helpers/getBaseRestUrl';
import getBaseUrl from '@/helpers/getBaseUrl';
import getBasketPath from '@/helpers/getBasketPath';
import getCartItems from '@/helpers/getCartItems';
import getCartItemsQuantity from '@/helpers/getCartItemsQuantity';
import getCartSectionNames from '@/helpers/getCartSectionNames';
import getCurrencyCode from '@/helpers/getCurrencyCode';
import getCustomConfigs from '@/helpers/getCustomConfigs';
import getEmptyAddress from '@/helpers/getEmptyAddress';
import getFallBackStaticPath from '@/helpers/getFallBackStaticPath';
import getGeneralTermsServicesId from '@/helpers/getGeneralTermsServicesId';
import getLocale from '@/helpers/getLocale';
import * as getLoqateUrls from '@/helpers/getLoqateUrls';
import getMaskedId from '@/helpers/getMaskedId';
import getPaymentExtensionAttributes from '@/helpers/getPaymentExtensionAttributes';
import * as getPenniesUrl from '@/helpers/getPenniesUrl';
import getPhoneValidation from '@/helpers/getPhoneValidation';
import getPrivacyPolicyId from '@/helpers/getPrivacyPolicyId';
import getShippingExtensionAttributes from '@/helpers/getShippingExtensionAttributes';
import getStaticPath from '@/helpers/getStaticPath';
import getStoreCode from '@/helpers/getStoreCode';
import getStoreId from '@/helpers/getStoreId';
import getSuccessPageUrl from '@/helpers/getSuccessPageUrl';
import getTokenTypes from '@/helpers/getTokenTypes';
import getUrlQuery from '@/helpers/getUrlQuery';
import getUrlTokens from '@/helpers/getUrlTokens';
import getWebsiteId from '@/helpers/getWebsiteId';
import getWithdrawTermsServicesId from '@/helpers/getWithdrawTermsServicesId';
import handleServiceError from '@/helpers/handleServiceError';
import isEmailValid from '@/helpers/isEmailValid';
import mapCustomConfigs from '@/helpers/mapCustomConfigs';
import redirectToBasketPage from '@/helpers/redirectToBasketPage';
import requestHokodoOffer from '@/helpers/requestHokodoOffer';
import scrollToTarget from '@/helpers/scrollToTarget';

export default {
  afterSubmittingShippingInformation,
  buildCartUrl,
  cleanAddress,
  createScriptLoadPromise,
  deepClone,
  doAddressesMatch,
  expressPaymentOnClick,
  formatAddress,
  formatClickAndCollectAddress,
  formatPrice,
  getAdditionalPaymentData,
  getAdyenProductionMode,
  getAfdUrls,
  getBaseRestUrl,
  getBaseUrl,
  getBasketPath,
  getCartItems,
  getCartItemsQuantity,
  getCartSectionNames,
  getCurrencyCode,
  getCustomConfigs,
  getEmptyAddress,
  getFallBackStaticPath,
  getGeneralTermsServicesId,
  getLocale,
  getLoqateUrls,
  getMaskedId,
  getPaymentExtensionAttributes,
  getPenniesUrl,
  getPhoneValidation,
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
  handleServiceError,
  isEmailValid,
  mapCustomConfigs,
  redirectToBasketPage,
  requestHokodoOffer,
  scrollToTarget,
};
