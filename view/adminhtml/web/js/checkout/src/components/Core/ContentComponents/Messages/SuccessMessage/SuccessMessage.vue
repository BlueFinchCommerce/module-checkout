<template>
  <div class="success-message" :style="style">
    <SuccessIcon />
    <TextField :text="message" />
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
