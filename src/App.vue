<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import AppTable from './components/AppTable.vue';
import AppInput from './components/shared/AppInput.vue';
import AppButton from './components/shared/AppButton.vue';
import AppDropdown from './components/shared/AppDropdown.vue';

// import AppDatePicker from './components/AppDatePicker/AppDatePicker.vue';
import AppPagination from './components/shared/AppPagination.vue';
import { fetchSchools, getDataFromAPI } from './services/ApiService'; 
import AppError from './components/shared/AppError.vue';
import AppDatePicker from './components/AppDatePicker/AppDatePicker.vue';
import AppSwitcher from './components/shared/AppSwitcher.vue';

const itemsSchools = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const totalPages = ref(10);
const itemsPerPageOptions = [10, 20, 30, 40, 50];
const itemsPerPage = ref(itemsPerPageOptions[0]);
const statuses = ref([]);
const selectedStatus = ref([]);
const gridColumns = ['Регионы', 'Название', 'Адрес', 'Уровень образования'];
const isError = ref(false);
const version = ref(true);

async function downloadSchoolsCSV() {
  try {
    const response = await fetch(`${API}?download=true`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schools.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to download schools data:', error);
  }
}


const filteredItemsSchools = computed(() => {
  if (!selectedStatus.value) return itemsSchools.value;
  return itemsSchools.value.filter((school) =>
    school.status.includes(selectedStatus.value)
  );
});



onMounted(async () => {
  const data = await fetchSchools(1, itemsPerPage.value);
  const { fetchedData } = getDataFromAPI(data);
  itemsSchools.value = fetchedData.items;
  statuses.value = fetchedData.statuses;
  totalPages.value = fetchedData.totalPages;
  currentPage.value = 1; 

  watch([currentPage, itemsPerPage], async (newValues) => {
  const page = newValues[0];
  const count = newValues[1];
  try {
    const data = await fetchSchools(page, count);
    const { fetchedData } = getDataFromAPI(data);
    itemsSchools.value = fetchedData.items;
    statuses.value = fetchedData.statuses;
    totalPages.value = fetchedData.totalPages;
    
  } catch (err) {
    console.error('Failed to fetch schools:', err);
    isError.value = true;
    if (page > totalPages.value) {
      currentPage.value = totalPages.value;
    } else if (page > 1) {
      currentPage.value++;
      setTimeout(() => {
      
      isError.value = false;
      document.body.style.overflow = 'auto';

    }, 3000);
    }
  }
});
});



</script>

<template>
  <AppError v-if="isError" :onScreen="isError"/>
  <section class="container">
    <div class="row-full">
      <h1 class="page-title">Таблица учреждений</h1>
      <div class="row">
        <AppDatePicker />
      <AppButton
          @click="downloadSchoolsCSV"
          icon="true"
          text="Скачать"
          property="accent"
        />
      </div>
    </div>
    <div class="row-full">
      <AppSwitcher @update="version = $event">
      Версия таблицы: {{ version }}
    </AppSwitcher>
        <AppInput type="search" :icon="true" @search="searchQuery = $event" />
      <AppDropdown
        :id="`organization-types`"
        :options="statuses"
        :name="`Все виды`"
        :label="`Все виды`"
        :empty-option-label="`Все виды`"
        @update="selectedStatus = $event"
      />
      <AppDropdown
        :id="`statuses`"
        :options="statuses"
        :name="`Все статусы`"
        :label="`Все статусы`"
        :empty-option-label="`Все статусы`"
        @update="selectedStatus = $event"
      />
    </div>
    <AppTable
      v-if="version"
      :data="filteredItemsSchools"
      :columns="gridColumns"
      :filter-key="searchQuery"
    />
    <AppTable
      v-if="!version"
      :data="filteredItemsSchools"
      :columns="gridColumns"
      :filter-key="searchQuery"
    />
    <div class="row-full">
      <AppPagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        :visiblePageNumbers="2"
        @update:currentPage="currentPage = $event"
      />
      <div class="items-per-page">
        <AppDropdown
          id="itemsPerPage"
          :name="`itemsPerPage`"
          :type="`number`"
          :options="itemsPerPageOptions"
          :label="`Показывать`"
          :showLabel="true"
          @update="itemsPerPage = $event"
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss">
section.container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  gap: 1.5rem;
  border-radius: 1rem;
  padding: 1.5rem;
  background-color: #fff;
  width: min( 1632px, 100% );
}

.items-per-page {
  display: flex;
  align-items: center;
}
.row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1.25rem;
}
.row-full {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;

}
.select-page {
  border: 1px solid var(--color-gray-d2);
  border-radius: 0.5rem;
  padding: 0.38rem 0.62rem 0.38rem 1rem;
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 130%;
  color: var(--color-base-black);
}
</style>
