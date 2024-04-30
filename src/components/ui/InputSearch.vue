<script setup>

const emit = defineEmits(['search']);

const props = defineProps({
 placeholder: {
    type: String,
    default: 'Поиск',
 },
});

const search = (e)=>{
    if (e.target.value == '' || e.target.value == ' ') {
        emit('search', null);
    }
    // Вызываем событие search с текущим значением поля поиска
    emit('search', e.target.value);
}

// Обработчик события submit для предотвращения перезагрузки страницы
const handleSubmit = (e) => {
 e.preventDefault();
}
</script>

<template>
 <form id="search" @submit.prevent="handleSubmit">
    <input
      class="search"
      name="query"
      type="search"
      @input="search($event)"
      :placeholder="placeholder"
    />
 </form>
</template>

<style>
form#search{
 margin: 0;
}
input.search{
 border: 1px solid #d3d3de;
 border-radius: 0.62rem;
 padding: 1rem 1.5rem;
 &[placeholder]{
    font-weight: 400;
    font-size: 1rem;
    line-height: 130%;
    color: #55555c;
 }
}
</style>
