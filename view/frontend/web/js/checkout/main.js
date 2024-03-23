/* eslint-disable no-param-reassign */
import { createApp, markRaw } from 'vue';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import router from '@/router';
import messages from '@/locales';
import helpers from '@/helpers';
import stores from '@/stores';

const i18n = createI18n({
  locale: 'blank',
  fallbackLocale: 'en',
  messages,
});

const pinia = createPinia();

pinia.use(({ store }) => {
  store.$router = markRaw(router);
  store.$i18n = markRaw(i18n);
});

const app = createApp(App);
app.use(i18n);
app.use(pinia);
app.use(router);

app.mount('#gene-better-checkout-root');

export default { helpers, stores };
