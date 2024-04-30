import { onMounted, onUnmounted } from 'vue';

export default {
 beforeMount(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!el.contains(event.target) && binding.value) {
        binding.value(event);
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
 },
 beforeUnmount(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
 },
};
