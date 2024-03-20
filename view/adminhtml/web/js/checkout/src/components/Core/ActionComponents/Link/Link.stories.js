import LinkComponent from './Link.vue';

export default {
  title: 'Global/Components/Link',
  component: LinkComponent,
  argTypes: {
    color: { control: 'color' },
    fontSize: {
      control: { type: 'select' },
      options: ['x-small', '12px', '14px', '16px',
        '18px', ' 20px', '24px', '28px', '32px', 'xx-large'],
    },
  },
};

const Template = (args) => ({
  components: { LinkComponent },
  setup() {
    return { args };
  },
  template: '<LinkComponent v-bind="args"/>',
});

export const LinkButtonComponent = Template.bind({});

LinkButtonComponent.args = {
  label: 'Link Label',
  fontWeight: '400',
  href: '',
};
