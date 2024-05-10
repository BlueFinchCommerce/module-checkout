<template>
  <div
    class="error-message"
    :class="{
      'error-message-attached': attached,
      'error-message-margin': margin,
    }"
    :style="style"
    :data-cy="dataCy ? dataCy : 'error-message'"
  >
    <TextField
      :text="message"
      :data-cy="dataCy ? `${dataCy}-text` : 'error-message-text'"
       />
  </div>
</template>
<script>
import { computed, reactive } from 'vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';

export default {
  name: 'ErrorMessage',
  components: {
    TextField,
  },
  props: {
    dataCy: {
      type: String,
    },
    message: {
      type: String,
      require: true,
      default: '',
    },
    attached: {
      type: Boolean,
      default: true,
    },
    margin: {
      type: Boolean,
      default: true,
    },
    backgroundColor: {
      type: String,
    },
    color: {
      type: String,
    },
    borderColor: {
      type: String,
    },
  },
  setup(props) {
    const reactiveProps = reactive(props);
    return {
      style: computed(() => ({
        backgroundColor: reactiveProps.backgroundColor,
        color: reactiveProps.color,
        borderColor: reactiveProps.borderColor,
      })),
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/core/form";
</style>
