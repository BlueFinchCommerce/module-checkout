import { createRouter, createWebHashHistory } from 'vue-router';
import SignInPage from '@/components/Steps/CustomerInfoPage/SignInPage/SignInPage.vue';
import DetailsPage from '@/components/Steps/CustomerInfoPage/DetailsPage/DetailsPage.vue';
import ShippingPage from '@/components/Steps/ShippingPage/ShippingPage.vue';
import PaymentPage from '@/components/Steps/PaymentPage/PaymentPage.vue';

const routes = [
  {
    path: '/',
    alias: [
      '/checkout',
    ],
    name: 'SignInPage',
    component: SignInPage,
    meta: {
      depth: 0,
    },
  },
  {
    path: '/details',
    name: 'DetailsPage',
    component: DetailsPage,
    meta: {
      depth: 1,
    },
  },
  {
    path: '/shipping',
    name: 'ShippingPage',
    component: ShippingPage,
    meta: {
      depth: 2,
    },
  },
  {
    path: '/payments',
    name: 'PaymentPage',
    component: PaymentPage,
    meta: {
      depth: 3,
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
  scrollBehavior() {
    return {
      el: '#vue-checkout-root',
      behavior: 'smooth',
    };
  },
});

export default router;
