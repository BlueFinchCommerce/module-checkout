import { createRouter, createWebHashHistory } from 'vue-router';
import DetailsPage from '@/components/Steps/CustomerInfoPage/DetailsPage/DetailsPage.vue';
import ShippingPage from '@/components/Steps/ShippingPage/ShippingPage.vue';
import PaymentPage from '@/components/Steps/PaymentPage/PaymentPage.vue';
import AmazonReview from '@/components/Steps/PaymentPage/Adyen/AmazonReview/AmazonReview.vue';

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
    path: '/adyen-amazon-review',
    name: 'AmazonReview',
    component: AmazonReview,
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
  scrollBehavior() {
    return {
      el: '#vue-checkout-root',
      behavior: 'smooth',
    };
  },
});

export default router;
