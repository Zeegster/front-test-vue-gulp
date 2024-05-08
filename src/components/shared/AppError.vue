<script setup>

</script>

<template>

  <div class="app-error">
    <div class="app-error__wrapper">


      <p class="app-error__text">Произошла ошибка! Приносим свои извинения</p>
      <p class="app-error__text">Мы решаем проблему</p>
      <p class="app-error__text">Вы будете перенаправлены на следующую рабочую страницу</p>
    </div>


  </div>

</template>


<style lang="scss" >

.app-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  text-align: center;
  background-color: var(--color-base-black-t10);
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 1;

  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 2rem 1rem;
    border-radius: 1rem;
    background-color: var(--color-white);
    gap: 1rem;
  }
  &__text {
    padding: 0;
    margin: 0;
    font-weight: 400;
    font-size: 1.25rem;
    line-height: 130%;
    color: var(--color-gray-d4);
  }
}

</style>