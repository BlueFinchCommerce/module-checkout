import authenticatedRequest from '@/services/authenticatedRequest';
import buildCartUrl from '@/helpers/buildCartUrl';

export default () => (
  authenticatedRequest().get(buildCartUrl('')).then((response) => response.data)
    .then((originalData) => {
      // If we have a customer and addresses then make sure all addresses have a company.
      const data = originalData;
      if (data?.customer?.addresses?.length) {
        data.customer.addresses = data.customer.addresses.map((address) => (
          {
            company: '',
            ...address,
          }
        ));
      }
      return data;
    })
);
