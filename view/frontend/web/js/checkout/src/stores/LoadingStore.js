import { defineStore } from 'pinia';

export default defineStore('loadingStore', {
  state: () => ({
    isLoading: false,
  }),
  actions: {
    setData(data) {
      this.$patch(data);
    },

    setLoadingState(state) {
      this.setData({
        isLoading: state,
      });
    },
  },
});
