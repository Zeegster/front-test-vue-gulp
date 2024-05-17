
<script setup>
import { ref } from 'vue';

const props = defineProps({
  name: { type: String, default: 'checkbox' },
});

const checked = ref(false);
const emit = defineEmits(['update:checked']);

function toggleCheckbox(event) {
  // do nothing when clicked on slot
  
checked.value = !checked.value;
  emit('update:checked', checked.value);
}
</script>

<template>
  <label :for="name" class="custom-checkbox"  @keydown.space.prevent="toggleCheckbox" tabindex="0">
    <input
      type="checkbox"
      :id="name"
      :name="name"
      :checked="checked"
      @change="toggleCheckbox($event)"
      class="custom-checkbox__input"
      :aria-checked="checked"
      :aria-label="name"
    />
    <span :class="`custom-checkbox__appearance ${checked ? 'checked' : ''}`">
      <svg id="checkbox-svg" width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.91666 18.8334H17.0833L18.3333 17.7917V3.20835L17.0833 2.16669H2.91666L1.66666 3.20835V17.7917L2.91666 18.8334Z" :fill="!checked? '#F1F4FD' : '#1B1B1F'" />
        <path v-show="checked" d="M5.3125 10.8031L8.4375 13.8334H9.16667L15.4167 7.16669" stroke="#F1F4FD" stroke-width="1.5" stroke-miterlimit="10" />
      </svg>
    </span>
    <slot></slot>
  </label>
</template>


<style lang="scss" scoped>
.custom-checkbox {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.62rem;
  cursor: pointer;
}

.custom-checkbox__input {
  appearance: none;
  opacity: 0;
  visibility: hidden;
  position: absolute;
  width: 0;
  height: 0;
}

.custom-checkbox__appearance {
  display: inline-block;
  width: 20px;
  height: 21px;
  border: 0;
  border-radius: 4px;
  pointer-events: none;

  &.checked {
    background-color: transparent;
  }
}

#checkbox-svg {
  display: block;
  width: 100%;
  height: 100%;
}

.custom-checkbox:focus-within.custom-checkbox__appearance {
  outline: 2px solid #F1F4FD;
  outline-offset: 2px;
}
</style>
