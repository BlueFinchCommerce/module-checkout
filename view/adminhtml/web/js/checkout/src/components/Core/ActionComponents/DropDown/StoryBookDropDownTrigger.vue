<template>
  <div class="dropdown-button" @click="openDropDown"
       @keydown="openDropDown"
       :class="{opened: isVisible}">
    <Shipping fill="black" />
    <TextField class="dropdown-ext" text="Lorem ipsum dolor sit amet"/>
    <ArrowDown class="dropdown-arrow__down" v-show="!isVisible"/>
    <ArrowUp class="dropdown-arrow__up" v-show="isVisible"/>
  </div>
  <DropDown v-show="isVisible" :class="{active: isVisible}">
    <template v-slot:content>
      <p>
        {{dropDownContent}}
      </p>
    </template>
  </DropDown>
</template>

<script>
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';
import Shipping from '@/components/Core/Icons/Shipping/Shipping.vue';
import ArrowDown from '@/components/Core/Icons/ArrowDown/ArrowDown.vue';
import ArrowUp from '@/components/Core/Icons/ArrowUp/ArrowUp.vue';
import DropDown from './DropDown.vue';

export default {
  name: 'StoryBookDropDownTrigger',
  components: {
    ArrowUp,
    ArrowDown,
    Shipping,
    TextField,
    DropDown,
  },
  props: {
    dropDownContent: {
      type: String,
    },
  },
  data() {
    return {
      isVisible: false,
    };
  },
  methods: {
    openDropDown() {
      this.isVisible = !this.isVisible;
    },
  },
};
</script>
