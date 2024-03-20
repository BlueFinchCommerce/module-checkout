import Container from './Container.vue';

const getColumnContent = (value, index) => (
  {
    name: 'TextField',
    props: {
      text: `This is column ${index + 1}`,
    },
  }
);

export default {
  title: 'Global/Components/Container',
  component: Container,
  argTypes: {
    columns: {
      mapping: {
        1: [...Array(1)].map(getColumnContent),
        2: [...Array(2)].map(getColumnContent),
        3: [...Array(3)].map(getColumnContent),
        4: [...Array(4)].map(getColumnContent),
      },
      control: {
        type: 'range',
        min: 1,
        max: 4,
      },
    },
  },
};

export const ContainerElement = (args) => ({
  components: { Container },
  setup() {
    return { args };
  },
  template: '<Container v-bind="args"/>',
});

ContainerElement.args = {
  columns: 1,
};
