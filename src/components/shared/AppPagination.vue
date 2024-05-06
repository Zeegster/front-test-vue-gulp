<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    default: 1,
  },
  visiblePageNumbers: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['update:currentPage']);

const previousPage = () => {
  if (props.currentPage > 1) {
    emit('update:currentPage', props.currentPage - 1);
  }
};

const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('update:currentPage', props.currentPage + 1);
  }
};

const goToPage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= props.totalPages) {
    emit('update:currentPage', pageNumber);
  }
};

const visiblePageNumbers = computed(() => {
  const startPage = Math.max(2, props.currentPage - 1);
  const endPage = Math.min(props.totalPages - 1, props.currentPage + 1);
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});
</script>


<template>
  <nav class="pagination">
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
          stroke="var(--color-gray-d4)"
          stroke-width="1.5"
          stroke-miterlimit="10"
        />
      </svg>    </button>
    <div class="pagination-page-numbers">
      <button
        @click="goToPage(1)"
        :class="{ active: currentPage === 1 }"
        :disabled="currentPage === 1"
      >
        1
      </button>
      <button
        v-if="currentPage > 3"
        @click="goToPage(currentPage - 2)"
      >
     ...
      </button>
      <button
        v-for="pageNumber in visiblePageNumbers"
        :key="pageNumber"
        :class="{ active: currentPage === pageNumber }"
        @click="goToPage(pageNumber)"
      >
        {{ pageNumber }}
      </button>
      <button
        v-if="currentPage < totalPages - 2"
        @click="goToPage(currentPage + 2)"
      >
     ...
      </button>
      <button
        @click="goToPage(totalPages)"
        :class="{ active: currentPage === totalPages }"
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
          stroke="var(--color-gray-d4)"
          stroke-width="1.5"
          stroke-miterlimit="10"
        />
      </svg>    </button>
  </nav>
</template>





<style>

.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  gap: 1.5rem;
}
.pagination-page-numbers {
  display: flex;
  /* align-items: center; */
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
  color: var(--color-base-black);
  &:hover {
    background: var(--color-base-white);
  }
}

.pagination-page-numbers button.active {
  background: var(--color-gray-d1);
}
.pagination-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid var(--color-gray-d2);
  border-radius: 0.5rem;
  width: 2.25rem;
  height: 2.25rem;
  background: transparent;
  transition: background 0.2s;
}
.pagination-button[disabled] {
  border: 1px solid var(--color-gray-d2);
  border-radius: 0.5rem;
  cursor: not-allowed;
}
.pagination-button:not([disabled]):hover {
  background: var(--color-base-white);
}
</style>