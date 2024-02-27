<template>
  <div class="dropdown-button" @click="openDropDown"
       @keydown="openDropDown"
       :class="{opened: isVisible}">
    <Shipping fill="black" />
    <TextField class="dropdown-ext" text="Lorem ipsum dolor sit amet"/>
    <ArrowDown class="dropdown-arrow__down" stroke="black" v-show="!isVisible"/>
    <ArrowUp class="dropdown-arrow__up" stroke="black" v-show="isVisible"/>
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
import DropDown from './DropDown.vue';
import TextField from '../TextField/TextField.vue';
import Shipping from '../Icons/Shipping/Shipping.vue';
import ArrowDown from '../Icons/ArrowDown/ArrowDown.vue';
import ArrowUp from '../Icons/ArrowUp/ArrowUp.vue';

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
