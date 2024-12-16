import formatPrice from '@/helpers/payment/formatPrice';
import graphQlRequest from '@/services/graphQlRequest';

const mergeProductCrosssells = (items) => (
  items.reduce((prev, item) => (
    item.crosssell_products
      ? prev.concat(item.crosssell_products)
      : prev
  ), [])
);

const convertToString = (sku) => (
  `"${sku}"`
);

export default (items) => {
  const productSkus = items.map(({ product: { sku } }) => sku);
  const request = `{
    products (
      filter: {
        sku: {
          in: [${productSkus.map(convertToString).join(',')}]
        }
      }
      pageSize: 10
    ) {
      items {
        crosssell_products {
          id
          __typename
          name
          stock_status
          thumbnail {
              url
              label
          }
          sku
          url_rewrites {
            url
          }
          price_range {
              minimum_price {
                  final_price {
                      value
                  }
              }
          }
        }
      }
    }
  }`;

  return graphQlRequest(request, {}, {}, 'BetterCheckoutCartCrosssells')
    .then((data) => (
      data.data.products.items.length
        ? mergeProductCrosssells(data.data.products.items)
          .filter((value, index, self) => index
              === self.findIndex((t) => (t.place === value.place && t.name === value.name)))
        : []
    ))
    .then((data) => (
      data.filter((product) => (
        product.stock_status === 'IN_STOCK'
            && product.price_range.minimum_price.final_price.value
            // eslint-disable-next-line no-underscore-dangle
            && product.__typename === 'SimpleProduct'
            && !productSkus.some((productSku) => productSku === product.sku)
      ))
    ))
    .then((data) => data.map((product) => (
      {
        formattedPrice: formatPrice(product.price_range.minimum_price.final_price.value),
        ...product,
      }
    )));
};
