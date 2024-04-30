<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  data: Array,
  columns: Array,
  filterKey: String,
});

const sortKey = ref('');
const sortOrders = ref(props.columns.reduce((o, key) => ((o[key] = 1), o), {}));

function getDataKey(columnKey) {
  const keyMap = {
    Регионы: 'region',
    Название: 'name',
    Адрес: 'address',
    'Уровень образования': 'educationLevel',
  };
  return keyMap[columnKey] || columnKey;
}

function updateSortOrder(key) {
  sortOrders.value[key] *= -1;
}

function sortBy(key) {
  updateSortOrder(key);
  sortKey.value = key;
}

const filteredData = computed(() => {
  let { data, filterKey } = props;
  if (filterKey) {
    filterKey = filterKey.toLowerCase();
    data = data.filter((row) => {
      
      return Object.values(row).some((value) => {
        
        if (Array.isArray(value)) {
          return value.some((item) => {
            return String(item).toLowerCase().indexOf(filterKey) > -1;
          });
        }
        // Otherwise, check the value directly
        return String(value).toLowerCase().indexOf(filterKey) > -1;
      });
    });
  }

  const key = sortKey.value;
  if (key) {
    data = data.slice().sort((a, b) => {
      const dataKey = getDataKey(key);
      const aValue = String(a[dataKey])
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      const bValue = String(b[dataKey])
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      console.log('Comparing:', aValue, 'and', bValue);

      return (
        (aValue === bValue ? 0 : aValue > bValue ? 1 : -1) *
        sortOrders.value[key]
      );
    });
  }
  return data;
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
</script>

<template>
  <table v-if="filteredData.length">
    <thead>
      <tr>
        <th
          v-for="key in columns"
          @click="sortBy(key)"
          :class="{ active: sortKey.value === key }"
        ><span>
         <h2>
          {{ capitalize(key) }}
         </h2> 
          
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                :d="
                  sortOrders[key] > 0
                    ? 'M12.6666 6L8.66309 2L4.66663 6'
                    : 'M12.6666 6L8.66309 2L4.66663 6'
                "
                :stroke="sortOrders[key] > 0 ? 'var(--color-gray-d3)' : 'var(--color-base-black)'"
                stroke-width="1.5"
                stroke-miterlimit="10"
              />
              <path
                :d="
                  sortOrders[key] > 0
                    ? 'M12.6666 10L8.67016 14L4.66663 10'
                    : 'M12.6666 10L8.67016 14L4.66663 10'
                "
                :stroke="sortOrders[key] > 0 ? 'var(--color-base-black)' : 'var(--color-gray-d3)'"
                stroke-width="1.5"
                stroke-miterlimit="10"
              />
            </svg>
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in filteredData">
        <td>{{ entry.region }}</td>
        <td>{{ entry.name }}</td>
        <td>{{ entry.address }}</td>
        <td class="tag-container">
          <span
            class="tag"
            v-for="entries in entry.educationLevel"
            >{{ entries }}</span
          >
        </td>
      </tr>
    </tbody>
  </table>
  <p
    class="loading"
    v-if="!data.length"
  >
    loading... <span class="loader"></span>
  </p>
  <p v-else-if="!filteredData.length">No results</p>
</template>

<style>
table,
tr,
th,
td,
tbody {
  margin: 0;
  padding: 0;
  border-spacing: 0;
}

table {
  background-color: #fff;
}

th {
  background-color: var(--color-gray-d1);
  color: rgba(255, 255, 255, 0.66);
  cursor: pointer;
  user-select: none;
  h2{

    font-weight: 700;
    font-size: 1rem;
    line-height: 130%;
    color: var(--color-gray-d4);
  }
  span{
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    svg{
      margin-top: auto;
      margin-bottom: auto;
    }
  }
}

tr {
  background-color: #fff;
}
tr:hover {
  background-color: var(--color-base-white);
}
td {
  border-bottom: 0.06rem solid var(--color-gray-d2);
  font-weight: 400;
  font-size: 0.88rem;
  line-height: 130%;
  color: var(--color-base-black);
}

th,
td {
  padding: 1rem;
  text-align: left;
}

th.active {
  color: var(--color-base-black);
}

th.active .arrow {
  opacity: 1;
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid var(--color-gray-d3);
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid var(--color-base-black);
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  gap: 0.25rem;
  .tag {
    border: 1px solid rgba(14, 14, 16, 0.1);
    border-radius: 0.5rem;
    padding: 0.25rem 0.38rem;
  }
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 0.5rem;
  font-size: 1rem;
  line-height: 130%;
  color: var(--color-base-black);
}
.loader {
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top: 3px solid var(--color-corp);
  width: 1.5rem;
  height: 1.5rem;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
