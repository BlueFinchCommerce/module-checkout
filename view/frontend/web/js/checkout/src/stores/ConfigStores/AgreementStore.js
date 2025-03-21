import { defineStore } from 'pinia';

export default defineStore('agreementStore', {
  state: () => ({
    agreements: {},
    showError: false,
  }),
  getters: {
    agreementIds: (state) => {
      const agreementValues = state.agreements ? Object.values(state.agreements) : [];
      return agreementValues.map((agreementValue) => agreementValue.agreement_id);
    },
  },
  actions: {
    setData(data) {
      this.$patch(data);
    },

    getInitialConfigValues() {
      return `
        checkoutAgreements {
          agreement_id
          name
          content
          checkbox_text
          mode
        }
      `;
    },

    handleInitialConfig({ checkoutAgreements }) {
      // Map the agreements to an object so we can call it using IDs.
      const formattedAgreements = checkoutAgreements.reduce((prev, curr) => {
        const allAgreements = prev;

        allAgreements[curr.agreement_id] = curr;

        return allAgreements;
      }, {});

      this.setData({ agreements: formattedAgreements });
    },

    updateAgreementData(agreement, approved) {
      this.setData({
        agreements: {
          [agreement.agreement_id]: {
            approved,
          },
        },
        showError: false,
      });
    },

    validateAgreements() {
      const { agreements } = this;
      const agreementValues = agreements ? Object.values(agreements) : [];
      // If there are no agreements then it must be auto approved.
      if (!agreementValues.length) {
        return true;
      }

      const updatedAgreements = agreementValues.map((agreement) => (
        {
          ...agreement,
          valid: agreement.mode !== 'MANUAL' || agreement.approved === true,
        }
      ));

      updatedAgreements.forEach((updatedAgreement) => {
        this.setData({
          agreements: {
            [updatedAgreement.agreement_id]: {
              ...updatedAgreement,
            },
          },
        });
      });

      const unaprovedAgreements = updatedAgreements.some((agreement) => (
        agreement.mode === 'MANUAL' && agreement.valid === false
      ));

      if (unaprovedAgreements) {
        this.setData({
          showError: true,
        });
      }

      return !unaprovedAgreements;
    },
  },
});
