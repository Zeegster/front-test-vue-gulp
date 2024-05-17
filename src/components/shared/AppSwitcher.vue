<script setup>
import { ref } from 'vue';
const props = defineProps({
  name: { type: String, default: 'radio' },
});

const emit = defineEmits(['update']);
const switcherState = ref(false);

function toggleSwitcherState() {
  switcherState.value =!switcherState.value;
  emit('update', !switcherState.value);
}
</script>


<template>
  <button
    id="switcher"
    :role="name"
    @click="toggleSwitcherState()"
    :class="`switcher-wrapper ${switcherState? 'on' : 'off'}`"
  >
    <svg
      :class="`switcher-circle ${switcherState? 'on' : 'off'}`"
      
      height="100"
      width="100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        r="45"
        cx="50"
        cy="50"
        stroke="green"
        stroke-width="3"
        fill="red"
      />
    </svg>
  </button>
  <slot></slot>
</template>

<style lang="scss" scoped>
.switcher-wrapper {
  position: relative;
  appearance: none;
  width: fit-content;
  height: fit-content;
  text-align: center;
  box-shadow:
    inset 0 0 -2rem 2rem var(--color-gray-d3),
    0 0 0 1px var(--color-gray-d4),
    0.4rem 0.4rem 2rem var(--color-gray-d4);

    position: relative;
    border: 2px solid var(--color-corp);
  border-radius: 12px;
  color: black;
  display: flex;
  height: calc(100px / 4);
  width: 50px;
  cursor: pointer;

  transition: all 500ms cubic-bezier(0.175, 0.89,0.25,1.87);

  .switcher-circle{
    transition: all 500ms cubic-bezier(0.175, 0.89,0.25,1.87);
  }

  &.on{
    border-color: var(--color-corp);
  }

  &.off{
    border-color: var(--color-gray-d3);
  }
}
.switcher-circle {
  border-radius: 50%;
  position: absolute;
  --size: calc(100px / 4 - 10px);
  --width: var(--size);
  --height: var(--size);
  width: var(--width);
  height: var(--height);
  top: calc(var(--height) / 12 * 2.5);
  left: 1px;

  &.on {
    left: calc(100% - var(--width) - 1px);
    background-color: var(--color-corp);
  }

  &.off {
    left: 1px;
    background-color: var(--color-gray-d3);
  }
}
</style>
