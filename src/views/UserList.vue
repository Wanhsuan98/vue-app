<template>
  <div class="flex h-screen flex-col box-border p-4">
    <header class="mb-4">
      <div class="flex w-full flex-col gap-3 md:w-1/2 md:flex-row">
        <div class="relative flex-1">
          <MagnifyingGlassIcon
            class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          />
          <input
            v-model="searchInput"
            type="text"
            aria-label="Search users by name, position, or location"
            placeholder="Search users..."
            class="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
            @input="onSearchInput"
          />
        </div>
      </div>

      <div class="mt-3 flex items-center justify-between rounded-md bg-gray-50 p-2 md:hidden">
        <span class="text-sm text-gray-500 font-medium">Sort by:</span>
        <select
          aria-label="Sort users by name, position, age, or location"
          class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
          @change="onMobileSort"
        >
          <option value="">Default (預設)</option>

          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>

          <option value="position-asc">Position (A-Z)</option>
          <option value="position-desc">Position (Z-A)</option>

          <option value="age-asc">Age (Low-High)</option>
          <option value="age-desc">Age (High-Low)</option>

          <option value="location-asc">Location (A-Z)</option>
          <option value="location-desc">Location (Z-A)</option>
        </select>
      </div>
    </header>

    <main class="flex-1 flex flex-col border border-gray-200 rounded-lg overflow-hidden">
      <div
        v-if="staticUser"
        class="flex-none bg-blue-50 border-b border-blue-100 p-4 transition-colors hover:bg-blue-100 md:grid md:h-[72px] md:grid-cols-4 md:items-center md:gap-4 md:p-4"
      >
        <div class="text-sm font-bold text-blue-900">
          <span class="md:hidden text-blue-400 text-xs mr-2">Name:</span>
          <span class="mr-2 rounded bg-blue-200 px-2 py-0.5 text-xs text-blue-800">VIP</span>
          {{ staticUser.name }}
        </div>
        <div class="text-sm font-semibold text-blue-800">
          <span class="md:hidden text-blue-400 text-xs mr-2">Position:</span>
          {{ staticUser.position }}
        </div>
        <div class="text-sm font-semibold text-blue-800">
          <span class="md:hidden text-blue-400 text-xs mr-2">Age:</span>
          {{ staticUser.age }}
        </div>
        <div class="text-sm font-semibold text-blue-800">
          <span class="md:hidden text-blue-400 text-xs mr-2">Location:</span>
          {{ staticUser.location }}
        </div>
      </div>
      <div
        class="hidden md:grid grid-cols-4 bg-gray-100 border-b border-gray-200 p-4 text-sm font-semibold text-gray-600"
      >
        <div
          v-for="col in tableColumns"
          :key="col.key"
          class="flex cursor-pointer items-center gap-1 select-none hover:text-blue-600"
          @click="handleSort(col.key)"
        >
          {{ col.label }}
          <div class="flex flex-col items-center -space-y-1">
            <ChevronDoubleUpIcon
              class="h-3.5 w-3.5 transition-colors"
              :class="
                queryParams.sortBy === col.key && queryParams.order === 'asc'
                  ? 'text-blue-600'
                  : 'text-gray-300'
              "
            />
            <ChevronDoubleDownIcon
              class="h-3.5 w-3.5 transition-colors"
              :class="
                queryParams.sortBy === col.key && queryParams.order === 'desc'
                  ? 'text-blue-600'
                  : 'text-gray-300'
              "
            />
          </div>
        </div>
      </div>

      <div v-bind="containerProps" class="flex-1 overflow-y-auto">
        <div v-bind="wrapperProps">
          <div
            v-for="item in virtualList"
            :key="item.data.id"
            class="flex flex-col gap-1 p-2 border-b border-gray-100 transition-colors hover:bg-gray-50 md:grid md:grid-cols-4 md:items-center md:gap-4 md:h-[72px] md:p-4"
          >
            <div class="text-sm font-medium text-gray-900 truncate">
              <span class="md:hidden text-gray-400 text-xs mr-2">Name:</span>
              {{ item.data.name }}
            </div>
            <div class="text-sm text-gray-600 truncate">
              <span class="md:hidden text-gray-400 text-xs mr-2">Position:</span>
              {{ item.data.position }}
            </div>
            <div class="text-sm text-gray-600 truncate">
              <span class="md:hidden text-gray-400 text-xs mr-2">Age:</span>
              {{ item.data.age }}
            </div>
            <div class="text-sm text-gray-600 truncate">
              <span class="md:hidden text-gray-400 text-xs mr-2">Location:</span>
              {{ item.data.location }}
            </div>
          </div>

          <div
            ref="bottomTrigger"
            class="flex h-[50px] items-center justify-center text-sm text-gray-400"
          >
            <span v-if="isLoading">Loading more data...</span>
            <span v-else-if="!hasMore">No more users.</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useVirtualList, useIntersectionObserver } from '@vueuse/core';
import { useUserManagement } from '@/composables/useUserManagement';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { ChevronDoubleUpIcon, ChevronDoubleDownIcon } from '@heroicons/vue/20/solid';
const {
  users,
  staticUser,
  isLoading,
  hasMore,
  queryParams,
  fetchUsers,
  handleSearch,
  handleSort,
  loadNextPage,
} = useUserManagement();

const tableColumns = [
  { key: 'name', label: 'Name' },
  { key: 'position', label: 'Position' },
  { key: 'age', label: 'Age' },
  { key: 'location', label: 'Location' },
] as const;

const searchInput = ref('');
const bottomTrigger = ref<HTMLElement | null>(null);

const {
  list: virtualList,
  containerProps,
  wrapperProps,
} = useVirtualList(users, {
  itemHeight: 72,
  overscan: 5,
});

const onSearchInput = () => handleSearch(searchInput.value);

useIntersectionObserver(bottomTrigger, ([entry]) => {
  if (entry.isIntersecting && !isLoading.value && hasMore.value) {
    loadNextPage();
  }
});

// 手機版排序下拉選單
const onMobileSort = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const value = target.value;

  if (!value) {
    queryParams.value.sortBy = '';
    queryParams.value.order = 'asc';
  } else {
    const [sortBy, order] = value.split('-');
    queryParams.value.sortBy = sortBy as 'name' | 'position' | 'location' | 'age';
    queryParams.value.order = order as 'asc' | 'desc';
  }

  // 觸發重新抓取資料
  fetchUsers();
};

onMounted(() => fetchUsers());
</script>
