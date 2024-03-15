<template>
  <div class="hokodo-method-title">
    <div class="hokodo-method-title__info">
      <TextField :text="data.hokodoData.hokodo_title"/>
      <div class="hokodo-logo" v-if="data.hokodoData.hokodo_show_logo">
        <img
          :src="HokodoLogo"
          :alt="data.hokodoData.hokodo_title"
        >
      </div>
      <TextField :text="data.hokodoData.hokodo_subtitle"/>
      <div class="hokodo-more-info">
        <MyButton :label="data.hokodoData.hokodo_more_info" @click="openModal"
                class="more-info-button"
                type="button"/>
        <modal
          :visible="isModalVisible"
          @close="closeModal"
        >
          <template #header>
            <div class="closer-container">
              <button
                type="button"
                class="button button--blank agreement-close"
                aria-label="Close"
                @click="closeModal"
              >
                ✕
              </button>
            </div>
          </template>
          <template #body>
            <hokodo-marketing id="hokodo-marketing-lightbox" data-element="lightbox"></hokodo-marketing>
          </template>
        </modal>
      </div>
    </div>
    <div class="hokodo-method-title__icons">
      <div v-for="icon in data.hokodoData.hokodo_logo_CC" :key="icon">
        <img
          :src="icon === 'amex' ? AmexLogo : icon === 'master_card' ? MasterCardLogo : visaLogo"
          :alt="data.hokodoData.hokodo_title"
        >
      </div>
      <img v-if="data.hokodoData.hokodo_logo_DD === 'UK'"
           :src="DDukLogo"
           :alt="data.hokodoData.hokodo_title"
      >
      <img v-if="data.hokodoData.hokodo_logo_DD === 'EU'"
           :src="DDlogo"
           :alt="data.hokodoData.hokodo_title"
      >
    </div>
  </div>
</template>

<script>

// components
import Modal from '@/components/Core/ActionComponents/Modal/Modal.vue';
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import MyButton from '@/components/Core/ActionComponents/Button/Button.vue';

// helpers
import getStaticUrl from '@/helpers/storeConfigs/getStaticPath';

// icons
import hokodoLogo from './icons/hokodo.svg';
import amexLogo from './icons/Hokodoamex.svg';
import Visalogo from './icons/hokodoV.svg';
import DDlogo from './icons/DD.svg';
import DDukLogo from './icons/DD_UK.svg';
import masterCardLogo from './icons/HokodoMaster_card.svg';

export default {
  name: 'HokodoComponent',
  components: {
    Modal,
    TextField,
    MyButton,
  },
  data() {
    return {
      isModalVisible: false,
    };
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    HokodoLogo() {
      return `${getStaticUrl(hokodoLogo)}`;
    },
    AmexLogo() {
      return `${getStaticUrl(amexLogo)}`;
    },
    visaLogo() {
      return `${getStaticUrl(Visalogo)}`;
    },
    DDlogo() {
      return `${getStaticUrl(DDlogo)}`;
    },
    DDukLogo() {
      return `${getStaticUrl(DDukLogo)}`;
    },
    MasterCardLogo() {
      return `${getStaticUrl(masterCardLogo)}`;
    },
  },
  methods: {
    async openModal() {
      await window.hokodoSdk.marketing();
      this.isModalVisible = true;
    },

    closeModal() {
      this.isModalVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/components/Steps/PaymentPage/Hokodo/styles.scss";
</style>
