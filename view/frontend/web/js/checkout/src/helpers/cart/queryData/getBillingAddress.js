import functionExtension from '@/extensions/functionExtension';

export default async () => {
  const billingAddress = `
    billing_address {
      city
      country {
        code
      }
      firstname
      lastname
      postcode
      region {
        code
        label
      }
      street
      telephone
    }
  `;

  const [modifiedCart] = await functionExtension('getBillingAddress', [billingAddress]);

  return modifiedCart;
};
