<script setup>
const props = defineProps({
  property: { type: String, default: 'primary' },
  text: { String, default: 'Button' },
  icon: { Boolean, default: false },
});
</script>

<template>
  <button
    class="button"
    :class="property"
  >
    <svg
      v-if="icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.5 5H5.5L4 6.25V21.75L5.5 23H16.5L18 21.75V20M20.8015 7.75H17.5L16 6.5V2.5M10 6H14M10 11H16M10 16H18M19.5 20H8.5C7.915 19.5125 7.585 19.2375 7 18.75V3.25C7.585 2.7625 7.915 2.4875 8.5 2H13H16.5L21 6V18.75C20.415 19.2375 20.085 19.5125 19.5 20Z"
        stroke="#0E0E10"
        stroke-width="1.5"
        stroke-miterlimit="10"
      />
    </svg>
    {{ text }}
  </button>
</template>

<style>
.button {
  all: unset;
  align-items: center;
  border-radius: 10px;
  box-sizing: border-box;
  display: inline-flex;
  gap: 8px;
  justify-content: center;
  padding: 16px 24px;
  color: var(--color-base-black);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 20.8px;
  position: relative;
  text-align: center;
  white-space: nowrap;
  transition: all 0.2s;
}

.button .UI-documents-doc {
  height: 24px !important;
  position: relative !important;
  width: 24px !important;
}

.button.accent:focus {
  background-color: var(--color-corp-focus);
}

.button.accent {
  background-color: var(--color-corp);
}

.button.accent:not(:focus):hover {
  background-color: var(--color-corp-hover);
}
.button.primary {
  color: var(--color-base-white);
  background-color: var(--color-base-black);
}
.button.primary:not(:focus):hover {
  color: var(--color-base-black);
  background-color: var(--color-corp-hover);
}
.button.primary:focus {
  color: var(--color-base-black);

  background-color: var(--color-corp-focus);
}
.button.secondary {
  color: #0e0e10;
  background-color: transparent;
  border: 1px solid #55555c;
}
.button.secondary:hover {
  border: 1px solid #0e0e10;
}
.button.secondary:focus {
  background-color: #f0f0f7;
  border: 1px solid #0e0e10;
}
</style>
