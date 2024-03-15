import { shallowMount } from '@vue/test-utils';
import getStaticUrl from '@/helpers/storeConfigs/getStaticPath';
import Logo from './Logo.vue';

jest.mock('@/helpers/storeConfigs/getStaticPath', () => jest.fn(() => '/path/to/logo.svg'));

describe('Logo.vue', () => {
  it('sets the correct src attribute for the logo image', () => {
    const wrapper = shallowMount(Logo);
    expect(wrapper.find('img').attributes('src')).toBe('/path/to/logo.svg');
    expect(getStaticUrl).toHaveBeenCalled();
  });

  it('renders alt text based on the alt prop', () => {
    const altText = 'Test Alt';
    const wrapper = shallowMount(Logo, {
      props: { alt: altText },
    });
    expect(wrapper.find('img').attributes('alt')).toBe(altText);
  });

  it('applies styles based on props', () => {
    const wrapper = shallowMount(Logo, {
      props: {
        width: '100px',
        height: '50px',
        fill: 'red',
        stroke: 'blue',
      },
    });
    const imgStyle = wrapper.find('img').attributes('style');
    expect(imgStyle).toContain('width: 100px');
    expect(imgStyle).toContain('height: 50px');
    expect(imgStyle).toContain('fill: red');
    expect(imgStyle).toContain('stroke: blue');
  });

  it('applies role attribute based on the role prop', () => {
    const role = 'presentation';
    const wrapper = shallowMount(Logo, {
      props: { role },
    });
    expect(wrapper.find('img').attributes('role')).toBe(role);
  });
});
