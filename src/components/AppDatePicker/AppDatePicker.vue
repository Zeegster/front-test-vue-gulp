<script setup>
import { ref, watch } from 'vue';
import { Day, Calendar } from './AppDatePicker';
import AppInput from '../shared/AppInput.vue';
import AppButton from '../shared/AppButton.vue';
import AppDropdown from '../shared/AppDropdown.vue';

const props = defineProps({
  format: {
    type: String,
    default: 'DD MMM YYYY',
  },
  position: {
    type: String,
    default: 'bottom',
    validator: (value) => ['top', 'left', 'bottom', 'right'].includes(value),
  },
});

const lang = window.navigator.language;
const date = ref(new Day(new Date()));
const calendar = ref(
  new Calendar(date.value.year, date.value.monthNumber, lang)
);
const showDatePicker = ref(false);
const selectedDateRange = ref(['', '']);
const selectedDateObjects = ref([]);
const isDisabledButton = ref(true);
const savedSelectedDates = ref([]);
const buttonState = ref('save');

const handleDateChange = (value) => {
  console.log('Date:', value);
};

const  toggleDatePicker = (e) => {
  if (!e) {
    return;
  }
  console.log('e', e);
  if (e.target.classList.contains('datepicker') || e.target.id === 'datepicker-reset'|| e.target.id === 'datepicker-submit') {
    showDatePicker.value = !showDatePicker.value;
    
  } else {
    showDatePicker.value = false;
  }
}


function goToMonth(month) {
  calendar.value = new Calendar(date.value.year, calendar.value.totalMonths.findIndex((m) => m === month) + 1, lang);
  calendar.value.month.nameUpCase = month;

}
function goToYear(year) {
  calendar.value = new Calendar(year, calendar.value.month.number, lang);
}
function nextMonth() {
  calendar.value.goToNextMonth();
  calendar.value = new Calendar(calendar.value.year, calendar.value.month.number, lang);
  calendar.value.month.nameUpCase = calendar.value.month.nameUpCase;

}

function prevMonth() {
  calendar.value.goToPreviousMonth();
  calendar.value = new Calendar(calendar.value.year, calendar.value.month.number, lang);
  calendar.value.month.nameUpCase = calendar.value.month.nameUpCase;


}

const isSelected = (date) => {
  return selectedDateRange.value.some((d) => d === date.dayFormat);
};
const isInRange = (date) => {
  if (
    selectedDateObjects.value.length != 2 ||
    selectedDateObjects.value[0].timestamp > date.timestamp ||
    selectedDateObjects.value[1].timestamp < date.timestamp
  ) {
    return;
  }
  const startDate = selectedDateObjects.value[0];
  const endDate = selectedDateObjects.value[1];

  
    return date.timestamp >= startDate.timestamp && date.timestamp <= endDate.timestamp;
  
};

const selectDate = (date) => {
  if(selectedDateRange.value.includes(date.dayFormat)) {
    selectedDateRange.value.map((d) => {
      if(d === date.dayFormat) {
        selectedDateRange.value = selectedDateRange.value.filter((d) => d !== date.dayFormat);
        selectedDateObjects.value = selectedDateObjects.value.filter((d) => d.dayFormat !== date.dayFormat);
        
      }
    })
  }
  if (selectedDateRange.value[0] === '') {
    selectedDateRange.value = [date.dayFormat, ''];
    selectedDateObjects.value = [date];
  } else if (selectedDateRange.value[1] === '') {
    if (selectedDateObjects.value[0].timestamp > date.timestamp) {
      selectedDateRange.value = [date.dayFormat, selectedDateRange.value[0]];
      selectedDateObjects.value = [date, selectedDateObjects.value[0]];
    } else {
      selectedDateRange.value = [selectedDateRange.value[0], date.dayFormat];
      selectedDateObjects.value = [selectedDateObjects.value[0], date];
    }
  } else {
    selectedDateRange.value = ['', ''];
  }

  if (selectedDateRange.value[0] !== '' && selectedDateRange.value[1] !== '') {
    isDisabledButton.value = false;
  }
};

function resetSelectedDateRange() {
 selectedDateRange.value = ['', ''];
 selectedDateObjects.value = [];
 isDisabledButton.value = true;
 
 buttonState.value = 'save';

 
}

function saveAndClose() {
 if (buttonState.value === 'save') {
    
    savedSelectedDates.value = [{datesRange : selectedDateRange.value, dates : selectedDateObjects.value}];
    
    buttonState.value = 'close';
 } else if (buttonState.value === 'close') {
    
    showDatePicker.value = false;
    
    buttonState.value = 'save';
 }
}
watch(calendar,()=>{

})

</script>

<template>
  <div class="datepicker-wrapper"
  

  >
    <AppInput
      :icon="true"
      type="datepicker"
      placeholder="Select a date"
      :iconEvent="toggleDatePicker"
      @update:modelValue="handleDateChange"
      :value="
        selectedDateRange[0]
          ? `${selectedDateRange[0]} - ${selectedDateRange[1]}`
          : date
          ? `${date.format(props.format)}`
          : 'Выберите период'
      "
      @click="toggleDatePicker"
      @focus="toggleDatePicker"
      
    />

    <table
      :class="`datepicker-table ${position}`"
     
      v-show="showDatePicker"
      v-click-outside="toggleDatePicker"
    >
      <thead class="datepicker-header">
        <tr>
          <th colspan="7">Выберите период</th>
        </tr>
      </thead>
      <tbody>
        <tr class="datepicker-months">
          <td>
            <button
              @click="prevMonth"
              class="datepicker-months__button"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 11.9947L15 6"
                  stroke="#0E0E10"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                />
              </svg>
            </button>
          </td>
          <td
            class="datepicker-months__title"
            colspan="5"
          >
            
            <AppDropdown name="month" type="datepicker" :emptyOptionLabel="calendar.month.nameUpCase" :options="calendar.totalMonths" :showArrow="false" @update="goToMonth"/>
            <AppDropdown name="year" type="datepicker" :emptyOptionLabel="`${calendar.month.year}`" :options="calendar.totalYears" :showArrow="false" @update="goToYear"/>
          </td>
          <td>
            <button
              @click="nextMonth"
              class="datepicker-months__button"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18L15 11.9947L9 6"
                  stroke="var(--color-gray-d4)"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                />
              </svg>
            </button>
          </td>
        </tr>
        <tr class="datepicker-weekdays">
          <th
            v-for="day in calendar.weekDaysShort"
            :key="day"
          >
            {{ day }}
          </th>
        </tr>
        <tr
          v-for="(week, weekIndex) in calendar.weeks"
          :key="weekIndex"
          class="datepicker-week"
        >
          <td
            v-for="(day, dayIndex) in week"
            :key="dayIndex"
            class="datepicker-week__day"
            :class="{
              'datepicker-week__day--current': day.monthNumber === calendar.month.number,
              'in-range': isInRange(day),
              selected: isSelected(day),
              //  'available': isAvailable(day.date),
              //  disabled: isDisabled(day.date),
            }"
            @click="selectDate(day)"
          >
            {{ day.date }}
          </td>
        </tr>
      </tbody>
      <tfoot class="datepicker-footer">
        <tr>
          <td colspan="7">
            <AppButton
              id="datepicker-reset"
              :text="!selectedDateRange[0] && !selectedDateRange[1] ? 'Закрыть' : 'Сбросить'"
              property="secondary"
              @click="!selectedDateRange[0] && !selectedDateRange[1] ? toggleDatePicker($event) : resetSelectedDateRange()"
            />
            <AppButton
            id="datepicker-submit"
            
              :disabled="isDisabledButton"
              :text="buttonState === 'save' ? 'Сохранить' : 'Закрыть'"
              @click="saveAndClose()"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.datepicker-wrapper {
  width: 100%;
  position: relative;
}
.datepicker-input {
  font-size: 1rem;
  text-align: center;
  position: relative;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 1.5rem;
  background-color: transparent;
  border: 1px solid var(--color-gray-d2);
  border-radius: 0.62rem;
  gap: 0.62rem;
}

.datepicker-table {
  position: absolute;
  border-radius: 1rem;
  padding: 1.5rem;
  background: var(--color-base-white);
  box-shadow: 0 5px 40px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
  z-index: 2;

  thead {
    tr {
      display: flex;
    }
  }

  &.top {
    bottom: 100%;
    top: auto;
  }

  &.bottom {
    top: 100%;
    bottom: auto;
  }

  &.left {
    top: 0;
    right: 100%;
    left: auto;
  }

  &.right {
    top: 0;
    left: 100%;
    right: auto;
  }
}

.datepicker-header th {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  white-space: nowrap;
  width: 100%;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-gray-d2);
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 140%;
}

.datepicker-months {
  display: flex;
  align-items: center;
  &__button {
    background-color: transparent;
    width: fit-content;
    height: fit-content;
    padding: 0;
    border: 0;
  }
  &__title {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    font-weight: 600;
    font-size: 1rem;
    line-height: 150%;
    letter-spacing: 0.02em;
    text-align: center;
    color: #111827;
  }
}

.datepicker-weekdays {
  display: flex;
  th {
    padding: 0.5rem 0rem;
    width: 100%;
    height: 2.12rem;
    font-weight: 400;
    font-size: 0.88rem;
    line-height: 130%;
    text-align: center;
    color: var(--color-gray-d3);
  }
}

.datepicker-week {
  display: flex;
  &__day {
    padding: 0.5rem 0rem;
    width: 100%;
    height: 34px;
    font-weight: 400;
    font-size: 0.88rem;
    line-height: 130%;
    text-align: center;
    color: var(--color-gray-d2);
    &--current {
      color: var(--color-base-black);
    }
    &:not(.selected) {
      &:hover {
        background-color: var(--color-corp-l1);
        cursor: pointer;
      }
    }
  }
}

.datepicker-footer tr {
  td {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.25rem;

    button {
      width: 9.25rem;
      height: 3.31rem;
    }
  }
}

.in-range {
  background-color: var(--color-corp-l1);
}

.selected {
  background-color: var(--color-corp);
}

.available:hover {
  background-color: var(--color-corp-hover);
}

.disabled {
  color: gray;
}
</style>
