<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  id: String,
  label: String,
  options: Array,
  name: String,
  emptyOptionLabel: {
    type: String,
    default: 'Choose a value',
  },
  showLabel: { type: Boolean, default: false },
  type: {
    type: String,
    default: 'default',
  },
});

const value = ref();
const dropdownHidden = ref(true);
const emit = defineEmits(['update']);

const selectOption = (option) => {
  if (option === null) {
    resetSelection();
  } else {
    value.value = option;
    dropdownHidden.value = true;
  }
};

const toggleDropdown = (e) => {
  if (e.target.id === `${props.name}-button-label`) {
    dropdownHidden.value = !dropdownHidden.value;
  } else {
    dropdownHidden.value = true;
  }
};

const resetSelection = () => {
  value.value = null;
  dropdownHidden.value = true;
};

const handleKeydown = (e) => {
  if ( e.key === ' ' || e.key === 'Enter') {
    e.preventDefault(); 
    selectOption(e.target.dataset.value)
  }
};

onMounted(() => {
  if (props.type === 'number') {
    value.value = props.options[0];
  }
});

watch(value, (newValue) => {
  emit('update', newValue);
});
</script>

<template>
  <div class="dropdown-wrapper">
    <label
      for="dropdown"
      class="dropdown-label"
      v-if="props.showLabel"
      >{{ props.label }}</label
    >
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
            stroke="var(--color-gray-d4)"
            stroke-width="1.5"
            stroke-miterlimit="10"
          />
        </svg>
      </button>
      <ul
        v-show="!dropdownHidden"
        :aria-labelledby="`${props.name}-label`"
        role="listbox"
        class="dropdown__list"
        ref="dropdownList"
        @keydown="handleKeydown($event)"

      >
        <li
          v-if="props.type !== 'number'"
          tabindex="0"
          class="dropdown__option"
          :class="{ 'dropdown__option--number': props.type === 'number' }"
          role="option"
          @click="selectOption()"
        >
          {{ props.label }}
        </li>
        <li
          v-for="(option, index) in props.options"
          tabindex="0"
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
.dropdown-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  gap: 0.38rem;
  width: 100%;

  .dropdown-label {
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 130%;
    color: var(--color-grayscale-600);
  }
  .dropdown {
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
    background: var(--color-gray-d2);
  }
  &.dropdown__option--number {
    width: 4.56rem;
    height: 2.25rem;
  }
}

.dropdown__button {
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
  cursor: pointer;
  &[aria-disabled='true'] {
    opacity: 0.5;
  }

  svg {
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
  background: var(--color-base-white);
}

.dropdown__list--top {
  bottom: 100%; /* Позиционируем список сверху относительно кнопки */
  top: auto; /* Сбрасываем верхнюю позицию */
}
</style>
