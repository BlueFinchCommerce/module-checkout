<template>
  <section class="calendar-wrapper">
    <div
      v-show="showCalendar && selectedDate"
      id="calendar-component"
      :key="selectedView"
      class="calendar-container"
      role="dialog"
      aria-labelledby="calendar-tile"
      aria-describedby="calendar-description"
      :aria-modal="showCalendar"
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
                'active': compareDates(selectedDate, date)
              }"
              @click="() => {
                selectDate(date)
              }"
            >
              <span class="calendar-radio-label">
                <span>{{ getDateLabel(date) }}</span>
                <span
                  v-if="showAvailableSymbol"
                  class="calendar-button-symbol"
                />
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
    <div
      v-show="showCalendar"
      class="calendar-wrapper-footer-text"
    >
      <TextField
        v-if="additionalFooterText"
        :text="additionalFooterText"
        class="calendar-wrapper-footer-text--additional"
      />
      <TextField
        :text="selectedDate ? formatedSelectedDate(selectedDate) : selectDateText"
        class="calendar-wrapper-footer-text--date"
      />
    </div>
  </section>
</template>

<script>
// components
import TextField from '@/components/Core/ContentComponents/TextField/TextField.vue';

// icons
import ArrowLeft from '@/components/Core/Icons/ArrowLeft/ArrowLeft.vue';
import ArrowRight from '@/components/Core/Icons/ArrowRight/ArrowRight.vue';

export default {
  name: 'CalendarComponent',
  components: {
    TextField,
    ArrowLeft,
    ArrowRight,
  },
  props: {
    availableDates: {
      type: Array,
      default: () => [],
    },
    selectDate: {
      type: Function,
      default: () => {},
    },
    showCalendar: {
      type: Boolean,
      default: false,
    },
    selectedDate: {
      type: String,
      default: '',
    },
    showAvailableSymbol: {
      type: Boolean,
      default: false,
    },
    additionalFooterText: {
      type: String,
      default: '',
    },
    selectDateText: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
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

  },

  mounted() {
    // Set calendar date to first available date
    const firstAvailableDay = this.availableDates[0];
    this.day = firstAvailableDay.getDate();
    this.month = firstAvailableDay.getMonth();
    this.year = firstAvailableDay.getFullYear();
  },
  methods: {
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
     * Get Month Label
     */
    getMonth(month = false) {
      const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      return month ? months[month] : months[this.month];
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

      return this.availableDates.some((availableDate) => {
        if (availableDate) {
          return this.compareDates(availableDate, currentDate);
        }
        return false;
      });
    },

    /**
     * Compare new dates
     */
    /* eslint-disable no-param-reassign */
    compareDates(firstDate, secondDate) {
      const normalisedFirstDate = this.normaliseDate(firstDate);
      const normalisedSecondDate = this.normaliseDate(secondDate);
      return normalisedFirstDate.getTime() === normalisedSecondDate.getTime();
    },

    /**
     * Normalise Date
     */
    normaliseDate(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      return new Date(year, month, day);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles.scss";
</style>
