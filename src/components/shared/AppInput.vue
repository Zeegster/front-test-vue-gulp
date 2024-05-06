<script setup>
const emit = defineEmits(['search', 'update:modelValue', 'focus', 'blur']);

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Поиск',
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) =>
      ['text', 'number', 'search', 'datepicker'].includes(value),
  },
  value:{
    deafult: null
  },
  icon: {
    type: Boolean,
    default: false,
  },
  iconEvent: {
    type: Function,
    default: () => {},
  },
});

const search = (e) => {
  const trimmedValue = e.target.value.trim();
  emit('search', trimmedValue || null);
};

const handleSubmit = (e) => {
  e.preventDefault();
};

const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
};

const handleFocus = () => {
  emit('focus');
};

const handleBlur = () => {
  emit('blur');
};
</script>

<template>
  <div :class="`input-wrapper ${type}`">
    <input
      :class="`input ${type}`"
      :type="type"
      :placeholder="placeholder"
      :value="value"
      @input="type === 'search' ? search($event) : handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <span
      v-if="icon"
      :class="`icon ${type}`"
    
    >
      <svg
        v-if="type === 'datepicker'"
        :class="`icon-svg ${type}`"
        width="25"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_2127_80)">
          <path
            d="M2.33325 10.25V3.75C2.65825 3.4575 2.84159 3.2925 3.16659 3H21.4999C21.8249 3.2925 22.0083 3.4575 22.3333 3.75V11.25M12.8333 22H3.83325L2.33325 20.75V9.25L3.83325 8H20.8333L22.3333 9.25M7.33325 12H9.33325M7.33325 15H9.33325M7.33325 18H9.33325M11.3333 12H13.3333M11.3333 15H13.3333M11.3333 18H13.3333M7.33325 1V5M17.3333 1V5M18.3333 15V18H20.3333M23.3333 17C23.3333 19.7614 21.0947 22 18.3333 22C15.5718 22 13.3333 19.7614 13.3333 17C13.3333 14.2386 15.5718 12 18.3333 12C21.0947 12 23.3333 14.2386 23.3333 17Z"
            stroke="#55555C"
            stroke-width="1.5"
            stroke-miterlimit="10"
          />
        </g>
        <defs>
          <clipPath id="clip0_2127_80">
            <rect
              width="24"
              height="24"
              fill="white"
              transform="translate(0.333252)"
            />
          </clipPath>
        </defs>
      </svg>

      <svg
        v-if="type === 'search'"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.8282 16.9588L17.287 16.4396L16.2486 17.522L16.7898 18.0412L17.8282 16.9588ZM21.4808 22.5412L22.022 23.0604L23.0604 21.978L22.5192 21.4588L21.4808 22.5412ZM19.25 11.0476C19.25 15.634 15.5526 19.3452 11 19.3452V20.8452C16.3885 20.8452 20.75 16.455 20.75 11.0476H19.25ZM11 19.3452C6.44738 19.3452 2.75 15.634 2.75 11.0476H1.25C1.25 16.455 5.6115 20.8452 11 20.8452V19.3452ZM2.75 11.0476C2.75 6.46123 6.44738 2.75 11 2.75V1.25C5.6115 1.25 1.25 5.64028 1.25 11.0476H2.75ZM11 2.75C15.5526 2.75 19.25 6.46123 19.25 11.0476H20.75C20.75 5.64028 16.3885 1.25 11 1.25V2.75ZM16.7898 18.0412L21.4808 22.5412L22.5192 21.4588L17.8282 16.9588L16.7898 18.0412Z"
          fill="#55555C"
        />
      </svg>
    </span>
  </div>
 
</template>

<style scoped>
form#search {
  margin: 0;
}
input {
  border: 1px solid var(--color-gray-d2);
  border-radius: 0.62rem;
  padding: 1rem 1.5rem;
  &[placeholder] {
    font-weight: 400;
    font-size: 1rem;
    line-height: 130%;
    color: var(--color-gray-d4);
  }
}

.input-wrapper {
  position: relative;
  display: inline-block;
}

.input-wrapper .icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.input-wrapper.search .icon {
  pointer-events: none;
}

.input-wrapper.datepicker .icon {

  cursor: pointer;

  svg {
    pointer-events: none;
  }
}
</style>
