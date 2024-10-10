import useCustomerStore from '@/stores/CustomerStore';
import functionExtension from '@/extensions/functionExtension';

export default async () => {
  const customerStore = useCustomerStore();

  const storeCredit = `
    ${customerStore.isLoggedIn
    ? `applied_store_credit {
          applied_balance {
            value
            currency
          }
        }`
    : ''}
  `;

  const [modifiedCart] = await functionExtension('getStoreCredit', [storeCredit]);

  return modifiedCart;
};
