<script setup>
import { ref, watch, onMounted, inject } from 'vue';
const openDropdown = inject('openDropdown');

const props = defineProps({
  id: String,
  label: String,
  options: Array,
  name: String,
  emptyOptionLabel: {
    type: String,
    default: 'Choose a value',
  },
  showLabel: {Boolean, default: false},
  type: {
    type: String,
    default: 'default',
  },
});

const emit = defineEmits(['update']);

const value = ref();
const dropdownHidden = ref(true);

onMounted(() => {
  if ( props.type === 'number') {
    value.value = props.options[0];
  }
});

const selectOption = (option) => {
  if (option === null) {
    // Проверяем, является ли выбранный элемент кнопкой сброса
    resetSelection();
  } else {
    value.value = option;
    dropdownHidden.value = true;
  }
};
const adjustDropdownPosition = () => {
 const dropdownList = document.querySelector('.dropdown__list');
 console.log(dropdownList.getBoundingClientRect());
 const rect = dropdownList.getBoundingClientRect();
 const windowHeight = window.innerHeight || document.documentElement.clientHeight;

 if (rect.bottom > windowHeight) {
    // Если выпадающий список касается нижней границы экрана, добавьте класс для отображения сверху
    dropdownList.classList.add('dropdown__list--top');
 } else {
    // В противном случае, убедитесь, что класс для отображения сверху удален
    dropdownList.classList.remove('dropdown__list--top');
 }
};

const toggleDropdown = (e) => {
  console.log(e.target.id === `${props.name}-button-label`);

  if ( e.target.id === `${props.name}-button-label` ) {
    
    dropdownHidden.value = !dropdownHidden.value;
    adjustDropdownPosition();
  }
  else {
    dropdownHidden.value = true;
  }
};


const resetSelection = () => {
  value.value = null; // Сбрасываем выбранное значение
  dropdownHidden.value = true; // Закрываем выпадающий список
};

watch(value, (newValue) => {
  emit('update', newValue);
});
</script>

<template>
  <div class="dropdown-wrapper">
    <label for="dropdown" class="dropdown-label" v-if="props.showLabel">{{ props.label }}</label>
    <div
      id="dropdown"
      class="dropdown"
      :value="value"
      ref="dropdown"
      v-click-outside="toggleDropdown"
    >
      
        <button
          :id="`${props.name}-button-label`"
          @click="toggleDropdown($event)"
  
          type="button"
          aria-haspopup="listbox"
          class="dropdown__button"
          :class="{
            'dropdown__button--active': !dropdownHidden,
            'dropdown__button--number': props.type === 'number',
          }"
        >
          {{ value ? value : props.emptyOptionLabel }}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.00012 9L12.0054 15L18.0001 9"
              stroke="#55555C"
              stroke-width="1.5"
              stroke-miterlimit="10"
            />
          </svg>
        </button>
     
      <ul
        v-show="!dropdownHidden"
        :aria-labelledby="`${props.name}-label`"
        tabindex="-1"
        role="listbox"
        class="dropdown__list"
        ref="dropdownList"
      >
        <li
          v-if="props.type !== 'number'"
          class="dropdown__option"
          :class="{ 'dropdown__option--number': props.type === 'number' }"
          role="option"
          @click="selectOption()"
        >
          {{props.label}}
        </li>
        <li
          v-for="(option, index) in props.options"
          :key="index"
          :data-value="option"
          class="dropdown__option"
          :class="{ 'dropdown__option--number': props.type === 'number' }"
          role="option"
          @click="selectOption(option)"
        >
          {{ option }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
.dropdown-wrapper{
  display: flex;
align-items: center;
justify-content: flex-start;
flex-direction: row;
gap: 0.38rem;
width: 100%;

  .dropdown-label{
    font-weight: 400;
font-size: 0.75rem;
line-height: 130%;
color: #687588;
  }
  .dropdown{
    width: 100%;

  }
}
.dropdown__trigger {
  z-index: 1;
}

[role='listbox'] {
  min-height: fit-content;
  max-height: 18rem;

  margin: 0;
  padding: 0;
  background: white;
  border: 1px solid #aaa;
}

[role='option'] {
  display: block;
  border-radius: 0.5rem;
  padding: 0.38rem 0.62rem 0.38rem 1rem;
  position: relative;
  line-height: 1.8em;
  font-size: 1rem;
  background: #e4e4ee;
  width: 100%;
  &.focused {
    background: #bde4ff;
  }
  &:hover {
    background: #d3d3de;
  }
  &.dropdown__option--number {
    width: 4.56rem;
    height: 2.25rem;
  }
}

button {
  position: relative;
 display: flex;
 align-items: center;
 justify-content: space-between; /* Adjust as needed */
 width: 100%;
 padding: 1rem 1.5rem;
 background-color: transparent;
 border: 1px solid #d3d3de;
 border-radius: 0.62rem;
 gap: 0.62rem;
 font-size: 16px;
 cursor: pointer;
  &[aria-disabled='true'] {
    opacity: 0.5;
  }
}

.dropdown__button {
  font-size: 1rem;
  text-align: center;
  position: relative;

  svg{
 position: relative;
 z-index: 1; /* Ensure the SVG is above the text */
 pointer-events: none; /* Ensure the SVG is clickable */

  }
}
.dropdown__button--active {
  svg {
    transform: rotate(180deg);
  }
}
.dropdown__button--number {
  padding: 0.38rem 0.62rem 0.38rem 1rem;
}
.dropdown__list {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 0.06rem;
  border: 0;
  max-height: 10rem;
  overflow-y: auto;
  position: absolute;
  z-index: 1;
  width: fit-content;
  border-radius: 0.75rem;
  padding: 0.38rem;
  box-shadow: 0 5px 40px 0 rgba(0, 0, 0, 0.1);
  background: #f1f4fd;
}

.dropdown__list--top {
 bottom: 100%; /* Позиционируем список сверху относительно кнопки */
 top: auto; /* Сбрасываем верхнюю позицию */
}

</style>
