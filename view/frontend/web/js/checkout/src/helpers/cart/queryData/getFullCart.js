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
  const fullCart = `
    id
    ${await getEmailField()}

    ${await getAppliedCoupons()}

    ${await getAppliedStoreCredit()}

    ${await getBillingAddress()}

    ${await getGiftCards()}

    ${await getGiftWrapping()}

    ${await getIsVirtual()}

    ${await getItems()}

    ${await getPaymentMethods()}

    ${await getPrices()}

    ${await getRewardPoints()}

    ${await getShippingAddresses()}
  `;

  const [modifiedCart] = await functionExtension('getFullCart', [fullCart]);

  return modifiedCart;
};
