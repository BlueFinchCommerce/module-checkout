import { defineStore } from 'pinia';

export default defineStore('vatDecStore', {
  state: () => ({
    showVatDec: false,
    vatDecDone: false,
    vatDecAmount: null,
  }),
  getters: {},
  actions: {
    setData(response) {
      this.showVatDec = response.data.vat_dec;
      this.vatDecDone = response.data.declaration_done;
      this.vatDecAmount = response.data.vat_dec_amount;
    },
  },
});
