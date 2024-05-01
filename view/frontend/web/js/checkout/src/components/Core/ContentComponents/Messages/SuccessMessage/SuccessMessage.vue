<template>
  <div
    class="success-message"
    :style="style"
    :data-cy="dataCy ? dataCy : 'success-message'"
  >
    <SuccessIcon :data-cy="dataCy ? `${dataCy}-icon` : 'success-icon'"/>
    <TextField
      :text="message"
      :data-cy="dataCy ? `${dataCy}-text` : 'success-message-text'"
    />
  </div>
</template>
<script>
import { computed, reactive } from 'vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import SuccessIcon from '@/components/Core/Icons/SuccessIcon/SuccessIcon.vue';

export default {
  name: 'SuccessMessage',
  components: {
    TextField,
    SuccessIcon,
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
