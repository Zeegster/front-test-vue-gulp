<script setup>
import { ref, computed } from 'vue';
import AppButton from './AppButton.vue';

const selectedDateRange = ref(['', '']);
const showCalendar = ref(false);
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const minDate = new Date(currentYear.value, currentMonth.value, 1);
const maxDate = new Date(currentYear.value, currentMonth.value + 1, 0);
maxDate.setMonth(maxDate.getMonth() + 1);

const calendarWeeks = computed(() => {
  const weeks = [];
  const startDate = new Date(currentYear.value, currentMonth.value, 1);
  while (startDate.getTime() <= new Date(currentYear.value, currentMonth.value + 1, 0).getTime()) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push({
        date: new Date(startDate.getTime()),
        day: startDate.getDate(),
      });
      startDate.setDate(startDate.getDate() + 1);
    }
    weeks.push(days);
  }
  return weeks;
});
const getMonthName = (month, locale = 'ru-RU') => {
  const monthName = new Date(0, month, 1).toLocaleString(locale, { month: 'long' }).split(' ')[0];
  return monthName.charAt(0).toUpperCase() + monthName.slice(1);
};
const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const isInRange = (date) => {
  const startDate = new Date(selectedDateRange.value[0]);
  const endDate = new Date(selectedDateRange.value[1]);
  return (
    (selectedDateRange.value[0] !== '' &&
      selectedDateRange.value[1] !== '' &&
      date >= startDate &&
      date <= endDate) ||
    (selectedDateRange.value[0] !== '' &&
      selectedDateRange.value[1] === '' &&
      date === selectedDateRange.value[0]) ||
    (selectedDateRange.value[1] !== '' &&
      selectedDateRange.value[0] === '' &&
      date === selectedDateRange.value[1])
  );
};

const isSelected = (date) => {
  return (
    (selectedDateRange.value[0] !== '' &&
      selectedDateRange.value[1] === '' &&
      date === selectedDateRange.value[0]) ||
    (selectedDateRange.value[1] !== '' &&
      selectedDateRange.value[0] === '' &&
      date === selectedDateRange.value[1])
  );
};

const isAvailable = (date) => {
  const startDate = new Date(currentYear.value, currentMonth.value, 1);
  const endDate = new Date(currentYear.value, currentMonth.value + 1, 0);
  return date >= startDate && date <= endDate;
};

const isDisabled = (date) => {
  return !isAvailable(date);
};

const selectDate = (date) => {
  if (isAvailable(date)) {
    if (selectedDateRange.value[0] === '') {
      selectedDateRange.value[0] = formatDate(date);
    } else if (selectedDateRange.value[1] === '') {
      if (new Date(selectedDateRange.value[0]) > date) {
        const temp = selectedDateRange.value[0];
        selectedDateRange.value[0] = formatDate(date);
        selectedDateRange.value[1] = temp;
      } else {
        selectedDateRange.value[1] = formatDate(date);
      }
    } else {
      selectedDateRange.value = ['', ''];
    }
  }
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year} ${month} ${day}`;
};

const updateSelectedDateRange = () => {
  if (
    selectedDateRange.value[0] !== '' &&
    selectedDateRange.value[1] === ''
  ) {
    selectedDateRange.value[1] = selectedDateRange.value[0];
  }
};

const closeCalendar = () => {
  showCalendar.value = false;
};

const saveAndClose = () => {

  closeCalendar();
};


</script>

<template>
  <div class="calendar-wrapper">
    <input
      type="text"
      class="calendar-input"
      :value="selectedDateRange[0]? `${selectedDateRange[0]} - ${selectedDateRange[1]}` : 'Выберите период'"
      @focus="showCalendar = true"
      @blur="updateSelectedDateRange"
    />
     <table class="calendar" v-if="showCalendar">
       <thead>
         <tr>
           <th colspan="7" class="calendar-header">Выберите период</th>
         </tr>
       </thead>
       <tbody>
         <tr class="calendar-months">
           <td>
             <button 
             @click="prevMonth"
             class="calendar-months__button">
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
           <td class="calendar-months__title" colspan="5">
  {{ getMonthName(currentMonth) + ' ' + currentYear || "Месяц Год" }}
</td>


           <td>
             <button 
             @click="nextMonth"
             class="calendar-months__button">
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
         <tr class="calendar-weekdays">
            <th v-for="day in ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']" :key="day">
  
             {{ day }}
           </th>
         </tr>
         <tr v-for="(week, index) in calendarWeeks" :key="index" class="calendar-week">
           <td
             v-for="day in week"
             :key="day.date"
             class="calendar-week__day"
             :class="{
               'in-range': isInRange(day.date),
               'selected': isSelected(day.date),
               'available': isAvailable(day.date),
               disabled: isDisabled(day.date),
             }"
             @click="selectDate(day.date)"
           >
             {{ day.day }}
           </td>
         </tr>
       </tbody>
       <tfoot>
         <tr class="calendar-footer">
           <td colspan="7">
            <AppButton text="Отмена" property="secondary" @click="closeCalendar" />
             <AppButton text="Сохранить" @click="saveAndClose" />
           </td>
         </tr>
       </tfoot>
     </table>
   </div>
 </template>
 
 <style lang="scss" scoped>
 .calendar-wrapper {
   width: 100%;
    position: relative;
 }
   .calendar-input {
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

 .calendar {
   position: absolute;
   border-radius: 1rem;
   padding: 1.5rem;
   background: var(--color-base-white);
   box-shadow: 0 5px 40px 0 rgba(0, 0, 0, 0.1);
   display: flex;
   justify-content: center;
   flex-direction: column;
   gap: 1rem;
   z-index: 1;
   
   thead{
      tr{
      display: flex;
   }}
 }
 
 .calendar-header {
   display: flex;
   align-items: flex-start;
   justify-content: center;
   flex-direction: column;
   width: 100%;
   padding-bottom: 1rem;
   border-bottom: 1px solid var(--color-gray-d2);
   font-weight: 700;
   font-size: 1.25rem;
   line-height: 140%;
 }
 
 .calendar-months {
   display: flex;
   &__button {
     background-color: transparent;
     width: fit-content;
     height: fit-content;
     padding: 0;
     border: 0;
   }
   &__title {
      width: 100%;
     font-weight: 600;
     font-size: 1rem;
     line-height: 150%;
     letter-spacing: 0.02em;
     text-align: center;
     color: #111827;
   }
 }
 
 .calendar-weekdays {
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
 
 .calendar-week {
   display: flex;
   &__day {
       
  padding: 0.5rem 0rem;
  width: 100%;
  height: 34px;
  font-weight: 400;
  font-size: 0.88rem;
  line-height: 130%;
  text-align: center;
  color: var(--color-gray-d3);

   }
 }
 
 .calendar-footer {
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
   background-color: var(--color-corp-l1);
   color: white;
 }
 
 .available:hover {
   background-color: var(--color-corp-hover);
 }
 
 .disabled {
   color: gray;
 }
 </style>