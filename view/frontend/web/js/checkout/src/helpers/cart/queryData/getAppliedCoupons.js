import functionExtension from '@/extensions/functionExtension';

export default async () => {
  const appliedCoupons = `
    applied_coupons {
      code
    }
  `;

  const [modifiedCart] = await functionExtension('getAppliedCoupons', [appliedCoupons]);

  return modifiedCart;
};
