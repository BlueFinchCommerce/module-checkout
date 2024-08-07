<template>
  <section class="nominated-container">
    <button
      v-show="!showCalender"
      ref="nominated"
      class="nominated-select"
      type="button"
      @click.prevent="openCalendar"
    >
      <TextField
        v-if="nominatedSelectedDate"
        :text="formatedSelectedDate(nominatedSelectedDate)"
        class="nominated-select-textfield"
      />
      <TextField
        v-else
        :text="$t('shippingStep.nominatedDelivery')"
        class="nominated-select-textfield"
      />
      <Calendar stroke="black" />
    </button>

    <!-- Calendar Start -->
    <div
      v-show="showCalender"
      id="nominated-calendar"
      :key="selectedView"
      class="calendar-container"
      role="dialog"
      aria-labelledby="calendar-tile"
      aria-describedby="calendar-description"
      :aria-modal="showCalender"
      @keyup.esc="closeCalendar()"
    >
      <header class="calendar-header">
        <button
          type="button"
          class="calendar-header-button"
          :disabled="disablePrevArrow"
          @click="decreaseMonth()"
        >
          <ArrowLeft
            width="8px"
            stroke="black"
          />
        </button>

        <p class="calendar-header-date">
          {{ getMonth() }} {{ year }}
        </p>

        <button
          type="button"
          class="calendar-header-button"
          :disabled="disableNextArrow"
          @click="increaseMonth()"
        >
          <ArrowRight
            width="8px"
            stroke="black"
          />
        </button>
      </header>

      <ol class="calendar-week">
        <li
          v-for="date in weekdays"
          :key="date"
          class="calendar-week-day"
        >
          <span v-text="date.substring(0, 2)" />
        </li>
      </ol>

      <ol class="calendar">
        <li
          v-for="date in emptyDays"
          :key="date"
          class="calendar-day"
        />

        <li
          v-for="date in numberOfDaysInMonth()"
          :key="date"
          class="calendar-day"
          :class="{
              'calendar-day--in-past': isDateInPast(date),
              'calendar-day--available': isAvailableDate(date)
            }"
        >
          <template v-if="isAvailableDate(date)">
            <button
              type="button"
              class="calendar-button"
              :class="{
                  'active': compareDates(nominatedSelectedDate, date)
                }"
              @click="selectDate(date)"
            >
                <span class="calendar-radio-label">
                  <span>{{ getDateLabel(date) }}</span>
                  <span class="calendar-button-symbol" />
                </span>
            </button>
          </template>

          <span
            v-else
            class="calendar-span"
          >{{ getDateLabel(date) }}</span>
        </li>
      </ol>
    </div>
    <!-- Calendar End -->

    <TextField
      v-show="showCalender"
      :text="$t('shippingStep.nominatedDeliveryCalendar')"
      class="nominated-select-calendar-text"
    />
  </section>
</template>

<script>
// Stores
import { mapState, mapActions, mapWritableState } from 'pinia';
import useShippingMethodsStore from '@/stores/ShippingMethodsStore';
import useLoadingStore from '@/stores/LoadingStore';

// components
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';

// icons
import Calendar from '@/components/Core/Icons/Calendar/Calendar.vue';
import ArrowLeft from '@/components/Core/Icons/ArrowLeft/ArrowLeft.vue';
import ArrowRight from '@/components/Core/Icons/ArrowRight/ArrowRight.vue';

export default {
  name: 'NominatedDay',
  components: {
    TextField,
    Calendar,
    ArrowLeft,
    ArrowRight,
  },
  props: {
    item: {
      type: Object,
      default() {
        return {
          method_code: '',
          carrier_code: '',
        };
      },
    },
  },
  data() {
    return {
      showCalender: false,
      isKeyboard: false,

      // Calendar Specific
      // Calendar Specific
      today: new Date(),
      day: null,
      month: null,
      year: null,

      emptyDays: 0, // Number of days in the week before the 1st

      weekdays: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
    };
  },
  computed: {
    ...mapWritableState(
      useShippingMethodsStore,
      ['nominatedSelectedMethod', 'nominatedSelectedDate', 'nominatedSelectedDateFormatted'],
    ),
    ...mapState(useShippingMethodsStore, ['nominatedDates']),

    /**
     * Disable prev arrow if month is this month
     */
    disablePrevArrow() {
      return this.month <= this.today.getMonth();
    },

    /**
     * Disable next arrow if month is this month + 1
     */
    disableNextArrow() {
      return this.month >= (this.today.getMonth() + 1);
    },

    /**
     * Get First Available Delivery Day
     */
    firstAvailableDay() {
      const availableDates = this.nominatedDates.filter(
        (method) => new Date(method.extension_attributes.date_required),
      );
      return new Date(availableDates[0].extension_attributes.date_required);
    },
  },
  mounted() {
    // Set calendar date to first available date
    const { firstAvailableDay } = this.firstAvailableDay;
    this.day = firstAvailableDay.getDate();
    this.month = firstAvailableDay.getMonth();
    this.year = firstAvailableDay.getFullYear();
  },
  methods: {
    ...mapActions(useLoadingStore, ['setLoadingState']),
    ...mapActions(useShippingMethodsStore, ['selectShippingMethod', 'submitShippingInfo']),

    /**
     * Show Calendar
     */
    openCalendar() {
      this.showCalender = true;
    },

    /**
     * Close Calendar
     */
    closeCalendar() {
      this.showCalender = false;
    },

    /**
     * Get Month Label
     */
    getMonth(month = false) {
      const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      return month ? months[month] : months[this.month];
    },

    /**
     * Return the formated date as per the designs (Thursday, 26th May 2022)
     */
    /* eslint-disable no-nested-ternary */
    formatedSelectedDate(date) {
      const day = date.getDate() + (date.getDate() % 10 === 1 && date.getDate() !== 11 ? 'st'
        : (date.getDate() % 10 === 2 && date.getDate() !== 12 ? 'nd'
          : (date.getDate() % 10 === 3 && date.getDate() !== 13 ? 'rd' : 'th')));
      const weekday = this.weekdays[date.getDay()];
      return `${weekday}, ${this.getMonth()} ${day} ${this.year}`;
    },

    /**
     * Select a day
     */
    async selectDate(date) {
      this.setLoadingState(true);
      this.nominatedSelectedDate = date;
      this.nominatedSelectedDateFormatted = this.formatedSelectedDate(date);
      // Update shipping method
      this.selectShippingMethod({
        nominatedSelectedDate: this.nominatedSelectedDate,
        nominatedSelectedDateFormatted: this.nominatedSelectedDateFormatted,
        ...this.item,
      });
      await this.submitShippingInfo();
      this.setLoadingState(false);
      this.closeCalendar();
    },

    /**
     * Get the days in the current month
     */
    numberOfDaysInMonth() {
      const date = new Date(this.year, this.month, 1);
      const dates = [];
      this.emptyDays = date.getDay();

      while (date.getMonth() === this.month) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      return dates;
    },

    /**
     * Get Day from label
     */
    getDateLabel(date) {
      return date.getDate();
    },

    /**
     * Increase the month by 1
     */
    /* eslint-disable no-plusplus */
    increaseMonth() {
      // If the month is december then increase the year and reset months
      if (this.month + 1 === 12) {
        this.month = 0;
        this.year++;
      } else {
        this.month++;
      }
    },

    /**
     * Decrease the month by 1
     */
    decreaseMonth() {
      // If the month is december then increase the year and reset months
      if (this.month === 0) {
        this.month = 11;
        this.year--;
      } else {
        this.month--;
      }
    },

    /**
     * Check if the date is in the past
     */
    isDateInPast(date) {
      return date.getTime() < (this.today.getTime()) - 1;
    },

    /**
     * Date is available for delivery
     */
    isAvailableDate(currentDate) {
      // If date is in the past then dont bother filtering
      if (this.isDateInPast(currentDate)) {
        return false;
      }
      // Filter dates
      /* eslint-disable array-callback-return */
      /* eslint-disable consistent-return */
      return this.nominatedDates.filter((method) => {
        if (method) {
          const date = new Date(method);
          return date.getTime() === currentDate.getTime();
        }
      }).length > 0;
    },

    /**
     * Compare new dates
     */
    /* eslint-disable no-param-reassign */
    compareDates(firstDate, secondDate) {
      firstDate = new Date(firstDate);
      return firstDate.getTime() === secondDate.getTime();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
