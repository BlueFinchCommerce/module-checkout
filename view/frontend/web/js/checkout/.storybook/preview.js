import { setup } from '@storybook/vue3'
import { createI18n } from 'vue-i18n';
import messages from '../src/locales';
import router from '../src/router';
import { createPinia } from 'pinia';

const i18n = createI18n({
  locale: 'en',
  messages
});

setup((app) => {
  app.use(i18n)
  app.use(router)
  app.use(createPinia());
})

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
