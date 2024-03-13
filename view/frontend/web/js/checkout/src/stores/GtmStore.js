import { defineStore } from 'pinia';
import useCartStore from '@/stores/CartStore';
import useConfigStore from '@/stores/ConfigStore';

export default defineStore('gtmStore', {
  state: () => ({
    active: undefined,
  }),
  actions: {
    setData(data) {
      this.$patch(data);
    },
    trackGtmEvent(event) {
      if (window.dataLayer) {
        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push(event);
      } else {
        document.addEventListener('ga:inited', () => {
          this.setData({
            active: true,
          });
          window.dataLayer.push({ ecommerce: null });
          window.dataLayer.push(event);
        });
      }
    },
    trackStep(actionField) {
      const { cart } = useCartStore();
      const { currencyCode } = useConfigStore();

      this.trackGtmEvent({
        event: 'checkoutSteps',
        ecommerce: {
          currencyCode,
          checkout: {
            actionField,
            products: cart.items,
          },
        },
      });
    },
    addToCartEvent(product, quantity) {
      const { currencyCode } = useConfigStore();

      this.trackGtmEvent({
        event: 'addToCart',
        ecommerce: {
          currencyCode,
          add: {
            actionField: {
              action: 'add',
              list: 'Shopping Basket',
            },
            products: [{
              id: product.item_id,
              name: product.name,
              price: product.price,
              quantity: quantity || 1,
              brand: product.brand,
              category: product.category_name,
            }],
          },
        },
      });
    },
    removeFromCartEvent(product, quantity) {
      const { currencyCode } = useConfigStore();

      this.trackGtmEvent({
        event: 'removeFromCart',
        ecommerce: {
          currencyCode,
          remove: {
            actionField: {
              action: 'remove',
              list: 'Shopping Basket',
            },
            products: [{
              id: product.item_id,
              name: product.name,
              price: product.price,
              quantity: quantity || 1,
              brand: product.brand,
              category: product.category_name,
            }],
          },
        },
      });
    },
  },
});
