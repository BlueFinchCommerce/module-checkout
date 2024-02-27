import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import PrivacyPolicy from '@/components/Core/PrivacyPolicy/PrivacyPolicy.vue';
import Modal from '@/components/Modal/Modal.vue';
import useConfigStore from '@/stores/ConfigStore';

// Setup i18n
const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      privacyPolicy: {
        content: 'Privacy Policy Content',
        link: 'Read More',
      },
    },
  },
});

describe('PrivacyPolicy.vue', () => {
  beforeEach(() => {
    // Setup Pinia and make it active
    setActivePinia(createPinia());

    // Mocking the store's state and actions
    const store = useConfigStore();
    store.privacyPolicy = { content: 'Mocked Privacy Policy Content' };
    store.getPrivacyPolicyBlock = jest.fn(() => Promise.resolve());
  });

  it('renders when privacy policy content is available', async () => {
    const wrapper = mount(PrivacyPolicy, {
      global: {
        plugins: [i18n],
        components: { Modal },
      },
    });

    await wrapper.vm.$nextTick(); // Wait for all promises and DOM updates to settle

    expect(wrapper.find('.privacy-policy-container').exists()).toBe(true);
    expect(wrapper.text()).toContain('Mocked Privacy Policy Content');
  });

  it('shows modal when "Read More" button is clicked', async () => {
    const wrapper = mount(PrivacyPolicy, {
      global: {
        plugins: [i18n],
        components: { Modal },
      },
    });

    await wrapper.vm.$nextTick();
    const button = wrapper.find('.privacy-policy-content_button');
    expect(button.exists()).toBe(true);

    await button.trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isModalVisible).toBe(true);
  });

  it('closes modal when close event is emitted from Modal component', async () => {
    const wrapper = mount(PrivacyPolicy, {
      global: {
        plugins: [i18n],
        components: { Modal },
      },
    });

    // Manually set the modal to visible for the purpose of this test
    wrapper.vm.isModalVisible = true;
    await wrapper.vm.$nextTick();

    const modalComponent = wrapper.findComponent(Modal);
    expect(modalComponent.exists()).toBe(true);

    await modalComponent.vm.$emit('close');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isModalVisible).toBe(false);
  });
});
