<template>
  <div class="flex h-screen flex-col box-border p-4">
    <UserSearchHeader
      v-model="searchInput"
      @search="onSearchInput"
      @mobile-sort="onMobileSort"
      @open-modal="openModal"
    />

    <main class="flex flex-1 flex-col overflow-hidden rounded-lg border border-gray-200">
      <UserTableHeader
        :columns="tableColumns"
        :sort-by="queryParams.sortBy"
        :order="queryParams.order"
        @sort="handleSort"
      />

      <div v-if="staticUser" class="bg-sky-50 border-b border-sky-200">
        <UserListItem
          :user="staticUser"
          :is-static="true"
          @edit="openModal"
          @delete="triggerDeleteModal"
        />
      </div>

      <div v-bind="containerProps" class="flex-1 overflow-y-auto">
        <div v-bind="wrapperProps">
          <UserListItem
            v-for="item in virtualList"
            :key="item.data.id"
            :user="item.data"
            :is-static="false"
            @edit="openModal"
            @delete="triggerDeleteModal"
          />
        </div>

        <div
          ref="bottomTrigger"
          class="flex h-[50px] items-center justify-center text-sm text-gray-400"
        >
          <span v-if="isLoading">Loading more data...</span>
          <span v-else-if="!hasMore">No more users.</span>
        </div>
      </div>
    </main>

    <UserFormModal
      :is-open="isModalOpen"
      :is-editing="isEditing"
      :form-data="formData"
      @close="closeModal"
      @save="saveUser"
    />

    <ConfirmDeleteModal :is-open="isdelModalOpen" @cancel="closeDelModal" @confirm="handleDelete" />
    <ToastNotification :show="showToast" :message="toastMessage" :type="toastType" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useVirtualList, useIntersectionObserver } from '@vueuse/core';
import { useUserManagement } from '@/composables/useUserManagement';

import UserSearchHeader from '@/components/UserSearchHeader.vue';
import UserTableHeader from '@/components/UserTableHeader.vue';
import UserListItem from '@/components/UserListItem.vue';
import UserFormModal from '@/components/UserFormModal.vue';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue';
import ToastNotification from '@/components/ToastNotification.vue';

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
  isModalOpen,
  isEditing,
  formData,
  openModal,
  handleDelete,
  saveUser,
  closeModal,
  isdelModalOpen,
  closeDelModal,
  triggerDeleteModal,
  toastMessage,
  toastType,
  showToast,
} = useUserManagement();

const searchInput = ref('');
const bottomTrigger = ref<HTMLElement | null>(null);

type SortKey = 'name' | 'position' | 'age' | 'location' | 'birthdate';

const tableColumns: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'position', label: 'Position' },
  { key: 'age', label: 'Age' },
  { key: 'birthdate', label: 'Birthdate' },
  { key: 'location', label: 'Location' },
];

const {
  list: virtualList,
  containerProps,
  wrapperProps,
} = useVirtualList(users, {
  itemHeight: 72,
  overscan: 5,
});

const onSearchInput = () => handleSearch(searchInput.value);

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
  fetchUsers();
};

useIntersectionObserver(bottomTrigger, ([entry]) => {
  if (entry.isIntersecting && !isLoading.value && hasMore.value) {
    loadNextPage();
  }
});

onMounted(() => fetchUsers());
</script>
