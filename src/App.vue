<script setup>
import DataTable from './components/DataTable.vue';
import { ref, onMounted, watch, computed, provide } from 'vue';
import InputSearch from './components/ui/InputSearch.vue';
import abbreviateInstitutionName from './components/utilities/FormatName';
import BaseButton from './components/ui/AppButton.vue';
import AppDropdown from './components/ui/AppDropdown.vue';
import formatAddress from './components/utilities/FormatAdress';
import abbreviateEducationLevel from './components/utilities/FormatEduLevels';
import AppDatePicker from './components/ui/AppDatePicker.vue';

const API = 'https://schooldb.skillline.ru/api/schools';
const itemsSchools = ref([]);
const searchQuery = ref('');
const currentPage = ref(1); // Start on the first page
const totalPages = ref(0); // Initialize total pages to 0
const itemsPerPageOptions = [10, 20, 30, 40, 50]; // Options for items per page
const itemsPerPage = ref(itemsPerPageOptions[0]); // Default items per page
const educationLevels = ref([]);
const statuses = ref([]);
const selectedStatus = ref([]);
const selectedEducationLevel = ref(''); // Инициализируем переменную выбранного уровня образования
const openDropdown = ref(null);

// Предоставление этого свойства для доступа из дочерних компонентов
provide('openDropdown', openDropdown);
// Function to fetch schools data with pagination and items per page
async function fetchSchools(page) {
  try {
    const response = await fetch(
      `${API}?page=${page}&count=${itemsPerPage.value}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
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
              supplement.educational_programs.map((program) => {
                if (
                  program.edu_level.name !== null &&
                  program.edu_level.name !== 'Не определен'
                ) {
                  return abbreviateEducationLevel(program.edu_level.name);
                } else {
                  return null;
                }
              })
            )
            .filter((level) => level !== null)
        )
      ), 
    }));

    totalPages.value = Math.ceil(data.data.pages_count);
    console.log(data.data);// Calculate total pages

    statuses.value = getStatus(data);
  } catch (err) {
    console.error('Failed to fetch schools:', err);
    // Fallback mechanism: Try fetching with a smaller count value
    if (itemsPerPage.value > 10) {
      itemsPerPage.value -= 10; // Уменьшаем количество элементов на странице
      await fetchSchools(currentPage.value); // Повторяем запрос с меньшим количеством данных
    } else if (currentPage.value > 1) {
      currentPage.value--; // Переходим на предыдущую страницу
      await fetchSchools(currentPage.value);
      // Повторяем запрос на предыдущей странице
    } else {
      console.error('Fallback failed. Unable to fetch schools.');
      // Обработка ошибки...
    }
  }
}

async function downloadSchoolsCSV() {
  try {
    // Fetch data from the API with the download parameter set to true
    const response = await fetch(`${API}?download=true`);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the Blob from the response
    const blob = await response.blob();

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schools.csv'; // Set the file name for the download

    // Append the link to the document body
    document.body.appendChild(link);

    // Programmatically click the link to start the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to download schools data:', error);
    // Handle the error as needed
  }
}

function getStatus(data) {
  const statuses = new Set(); // Используем Set для уникальности уровней образования

  // Проверяем, что data.data.list существует и является массивом
  if (Array.isArray(data.data.list)) {
    data.data.list.forEach((item) => {
      // Проверяем, что educational_programs существует и является массивом
      if (item && Array.isArray(item.supplements)) {
        item.supplements.forEach((supplement) => {
          // Проверяем, что educational_programs существует и является массивом
          
              if (
                supplement.status &&
                supplement.status.name !== null
              ) {
                statuses.add(supplement.status.name);
              }
            
          
        });
      }
    });
  }

  return Array.from(statuses); // Преобразуем Set обратно в массив
}
function getEducationLevels(data) {
  const educationLevels = new Set(); // Используем Set для уникальности уровней образования

  // Проверяем, что data.data.list существует и является массивом
  if (Array.isArray(data.data.list)) {
    data.data.list.forEach((item) => {
      // Проверяем, что educational_programs существует и является массивом
      if (item && Array.isArray(item.supplements)) {
        item.supplements.forEach((supplement) => {
          // Проверяем, что educational_programs существует и является массивом
          if (supplement && Array.isArray(supplement.educational_programs)) {
            supplement.educational_programs.forEach((program) => {
              if (
                program.edu_level &&
                program.edu_level.name !== 'Не определен' &&
                program.edu_level.name !== null
              ) {
                educationLevels.add(program.edu_level.name);
                console.log(educationLevels);
              }
            });
          }
        });
      }
    });
  }

  return Array.from(educationLevels); // Преобразуем Set обратно в массив
}
const filteredItemsSchools = computed(() => {
  if (!selectedStatus.value) {
    return itemsSchools.value;
  }
  return itemsSchools.value.filter((school) =>
    school.status.includes(selectedStatus.value)
  );
});

// Fetch schools data on component mount and when the page or items per page changes
onMounted(() => fetchSchools(currentPage.value));
watch([currentPage, itemsPerPage], () => fetchSchools(currentPage.value));

const gridColumns = ['Регионы', 'Название', 'Адрес', 'Уровень образования'];
const visiblePageNumbers = computed(() => {
  const startPage = Math.max(2, currentPage.value - 1);
  const endPage = Math.min(totalPages.value - 1, currentPage.value + 1);
  return Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );
});
// Function to navigate to the previous page
function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

// Function to navigate to the next page
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}
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
      <AppDatePicker v-model="date" />
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
      <div class="pagination">
        <button
          class="pagination-button pagination-prev"
          @click="previousPage"
          :disabled="currentPage === 1"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 11.9947L15 6"
              stroke="#55555C"
              stroke-width="1.5"
              stroke-miterlimit="10"
            />
          </svg>
        </button>
        <div class="pagination-page-numbers">
          <button
            @click="currentPage = 1"
            :class="{ active: currentPage === 1 }"
            :disabled="currentPage === 1"
          >
            1
          </button>
          <button
            v-if="currentPage > 3"
            @click="currentPage = currentPage - 2"
          >
            ...
          </button>
          <button
            v-for="pageNumber in visiblePageNumbers"
            :key="pageNumber"
            :class="{ active: currentPage === pageNumber }"
            @click="currentPage = pageNumber"
          >
            {{ pageNumber }}
          </button>
          <button
            v-if="currentPage < totalPages - 2"
            @click="currentPage = currentPage + 2"
          >
            ...
          </button>
          <button
            @click="currentPage = totalPages"
            :disabled="currentPage === totalPages"
          >
            {{ totalPages }}
          </button>
        </div>
        <button
          class="pagination-button pagination-next"
          @click="nextPage"
          :disabled="currentPage === totalPages"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 11.9947L9 6"
              stroke="#55555C"
              stroke-width="1.5"
              stroke-miterlimit="10"
            />
          </svg>
        </button>
      </div>
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
.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  gap: 1.5rem;
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
  border: 1px solid #d3d3de;
  border-radius: 0.5rem;
  padding: 0.38rem 0.62rem 0.38rem 1rem;
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 130%;
  color: #0e0e10;
}
.pagination-page-numbers {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  gap: 0.12rem;
}
.pagination-page-numbers button {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 2.25rem;
  height: 2.25rem;
  border: 0;
  border-radius: 0.5rem;
  background: transparent;
  transition: background 0.2s;
  pointer-events: all;
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 130%;
  color: #0e0e10;
  &:hover {
    background: #f1f4fd;
  }
}

.pagination-page-numbers button.active {
  background: #f0f0f7;
}
.pagination-button {
  border: 1px solid #d3d3de;
  border-radius: 0.5rem;
  padding: 0.38rem 0.62rem;

  background: transparent;
  transition: background 0.2s;
}
.pagination-button[disabled] {
  border: 1px solid #d3d3de;
  border-radius: 0.5rem;
  padding: 0.38rem 0.62rem;
}
.pagination-button:not([disabled]):hover {
  background: #f1f4fd;
}
form#search {
  margin: 0;
}
input.search {
  border: 1px solid #d3d3de;
  border-radius: 0.62rem;
  padding: 1rem 1.5rem;
  &[placeholder] {
    font-weight: 400;
    font-size: 1rem;
    line-height: 130%;
    color: #55555c;
  }
}
</style>
