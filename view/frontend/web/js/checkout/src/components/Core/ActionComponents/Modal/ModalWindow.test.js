import { shallowMount } from '@vue/test-utils';
import Modal from './Modal.vue';

describe('Modal.vue', () => {
  it('Modal exist', () => {
    const wrapper = shallowMount(Modal);
    expect(wrapper.isVisible()).toBe(true);
    expect(wrapper.findComponent(Modal).exists()).toBe(true);
  });

  it('renders modal based on visibility prop', async () => {
    const wrapper = shallowMount(Modal, {
      propsData: { visible: true },
    });
    expect(wrapper.find('.modal-backdrop').isVisible()).toBe(true);
    expect(wrapper.find('.modal').isVisible()).toBe(true);
  });

  it('emits close event when backdrop is clicked', async () => {
    const wrapper = shallowMount(Modal);
    wrapper.find('.modal-backdrop').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().close).toBeTruthy();
  });

  it('emits focus event on keydown', async () => {
    const wrapper = shallowMount(Modal, {
      propsData: { visible: true }, // Ensure the modal is visible to interact with it
    });
    // Trigger keydown on the modal element that listens to the event
    await wrapper.find('.modal').trigger('keydown');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().focus).toBeTruthy();
  });

  it('renders header and footer based on props', () => {
    const wrapper = shallowMount(Modal, {
      propsData: { header: true, footer: true },
    });
    expect(wrapper.find('.modal-header').exists()).toBe(true);
    expect(wrapper.find('.modal-footer').exists()).toBe(true);
  });

  it('applies custom classes from props', () => {
    const customClasses = 'custom-class';
    const wrapper = shallowMount(Modal, {
      propsData: { classes: customClasses },
    });
    expect(wrapper.find('.modal').classes()).toContain(customClasses);
  });

  it('displays default slot content for body', () => {
    const wrapper = shallowMount(Modal);
    const defaultBodyContent = 'This is the default body!';
    expect(wrapper.find('.modal-body').text()).toContain(defaultBodyContent);
  });
});
