import functionExtension from '@/extensions/functionExtension';

import getAppliedCoupons from '@/helpers/cart/queryData/getAppliedCoupons';
import getAppliedStoreCredit from '@/helpers/cart/queryData/getAppliedStoreCredit';
import getBillingAddress from '@/helpers/cart/queryData/getBillingAddress';
import getGiftCards from '@/helpers/cart/queryData/getGiftCards';
import getGiftWrapping from '@/helpers/cart/queryData/getGiftWrapping';
import getIsVirtual from '@/helpers/cart/queryData/getIsVirtual';
import getItems from '@/helpers/cart/queryData/getItems';
import getPaymentMethods from '@/helpers/cart/queryData/getPaymentMethods';
import getPrices from '@/helpers/cart/queryData/getPrices';
import getRewardPoints from '@/helpers/cart/queryData/getRewardPoints';
import getShippingAddresses from '@/helpers/cart/queryData/getShippingAddresses';
import getEmailField from '@/helpers/cart/queryData/getEmailField';

export default async () => {
  // Initialize the fullCart with mandatory fields
  let fullCart = `
    id
    ${await getEmailField()}
    ${await getAppliedCoupons()}
    ${await getBillingAddress()}
    ${await getIsVirtual()}
    ${await getItems()}
    ${await getPaymentMethods()}
    ${await getPrices()}
    ${await getShippingAddresses()}
  `;

  // Conditionally add gift wrapping and gift cards for Enterprise edition only
  if (window.geneCheckout && window.geneCheckout.magentoEdition !== 'Community') {
    fullCart += `
      ${await getGiftCards()}
      ${await getGiftWrapping()}
      ${await getRewardPoints()}
      ${await getAppliedStoreCredit()}
    `;
  }

  // Call the function extension and return the modified cart
  const [modifiedCart] = await functionExtension('getFullCart', [fullCart]);

  return modifiedCart;
};
