<script setup>

const emit = defineEmits(['search']);

const props = defineProps({
 placeholder: {
    type: String,
    default: 'Выберите период',
 },
});


</script>

<template>
 <form id="date" @submit.prevent="handleSubmit">
    <input
      class="date-picker"
      name="query"
      type="date"
      
      :placeholder="placeholder"
    />
 </form>
</template>

<style>
form#date{
  width: 100%;

 margin: 0;
}
input.date-picker{
 border: 1px solid #d3d3de;
 border-radius: 0.62rem;
 padding: 1rem 1.5rem;
 width: 100%;

 &[placeholder]{
    font-weight: 400;
    font-size: 1rem;
    line-height: 130%;
    color: #55555c;
 }
}
</style>
