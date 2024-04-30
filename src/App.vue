<script setup>
import { ref, onMounted, watch, computed, provide } from 'vue';
import DataTable from './components/DataTable.vue';
import InputSearch from './components/ui/InputSearch.vue';
import abbreviateInstitutionName from './components/utilities/FormatName';
import BaseButton from './components/ui/AppButton.vue';
import AppDropdown from './components/ui/AppDropdown.vue';
import formatAddress from './components/utilities/FormatAdress';
import abbreviateEducationLevel from './components/utilities/FormatEduLevels';
import AppDatePicker from './components/ui/AppDatePicker.vue';
import AppPagination from './components/ui/AppPagination.vue';

const API = 'https://schooldb.skillline.ru/api/schools';
const itemsSchools = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const totalPages = ref(10);
const itemsPerPageOptions = [10, 20, 30, 40, 50];
const itemsPerPage = ref(itemsPerPageOptions[0]);
const statuses = ref([]);
const selectedStatus = ref([]);

async function fetchSchools(page) {
  try {
    const response = await fetch(
      `${API}?page=${page}&count=${itemsPerPage.value}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    itemsSchools.value = data.data.list.map((school) => ({
      region: school.edu_org.region.name,
      name: abbreviateInstitutionName(school.edu_org.full_name),
      address: formatAddress(school.edu_org.contact_info.post_address),
      status: school.supplements[0].status.name,
      educationLevel: Array.from(
        new Set(
          school.supplements
            .flatMap((supplement) =>
              supplement.educational_programs.map((program) =>
                program.edu_level.name !== null &&
                program.edu_level.name !== 'Не определен'
                  ? abbreviateEducationLevel(program.edu_level.name)
                  : null
              )
            )
            .filter((level) => level !== null)
        )
      ),
    }));
    totalPages.value = Math.ceil(data.data.pages_count);
    statuses.value = getStatus(data);
  } catch (err) {
    console.error('Failed to fetch schools:', err);
    if (itemsPerPage.value > 10) {
      itemsPerPage.value -= 10;
      await fetchSchools(currentPage.value);
    } else if (currentPage.value > 1) {
      currentPage.value--;
      await fetchSchools(currentPage.value);
    } else {
      console.error('Fallback failed. Unable to fetch schools.');
    }
  }
}

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

function getStatus(data) {
  const statuses = new Set();
  if (Array.isArray(data.data.list)) {
    data.data.list.forEach((item) => {
      if (item && Array.isArray(item.supplements)) {
        item.supplements.forEach((supplement) => {
          if (supplement.status && supplement.status.name !== null) {
            statuses.add(supplement.status.name);
          }
        });
      }
    });
  }
  return Array.from(statuses);
}

const filteredItemsSchools = computed(() => {
  if (!selectedStatus.value) return itemsSchools.value;
  return itemsSchools.value.filter((school) =>
    school.status.includes(selectedStatus.value)
  );
});

const gridColumns = ['Регионы', 'Название', 'Адрес', 'Уровень образования'];


onMounted(() => fetchSchools(currentPage.value));

watch([currentPage, itemsPerPage], () => fetchSchools(currentPage.value));

</script>

<template>
  <section class="container">
    <div class="row-full">
      <h1 class="page-title">Таблица учреждений</h1>
      <div class="row">
        <InputSearch @search="searchQuery = $event" />
        <BaseButton
          @click="downloadSchoolsCSV"
          icon="true"
          text="Скачать"
          property="accent"
        />
      </div>
    </div>
    <div class="row-full">
      <AppDatePicker />
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
    <DataTable
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

<style>
section.container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  gap: 1.5rem;
  border-radius: 1rem;
  padding: 1.5rem;
  background-color: #fff;
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
