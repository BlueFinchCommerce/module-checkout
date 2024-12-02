import { createRouter, createWebHashHistory } from 'vue-router';
import DetailsPage from '@/components/Steps/CustomerInfoPage/DetailsPage/DetailsPage.vue';
import ShippingPage from '@/components/Steps/ShippingPage/ShippingPage.vue';
import PaymentPage from '@/components/Steps/PaymentPage/PaymentPage.vue';

const routes = [
  {
    path: '/',
    alias: [
      '/checkout',
    ],
    name: 'DetailsPage',
    component: DetailsPage,
    meta: {
      depth: 0,
    },
  },
  {
    path: '/shipping',
    name: 'ShippingPage',
    component: ShippingPage,
    meta: {
      depth: 1,
    },
  },
  {
    path: '/payments',
    name: 'PaymentPage',
    component: PaymentPage,
    meta: {
      depth: 2,
    },
  },
  {
    path: '/*',
    redirect: '/',
    meta: {
      depth: 0,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from) {
    if (from.name) {
      return {
        el: '.root',
        behavior: 'smooth',
      };
    }

    return { top: 0 };
  },
});

export default router;
