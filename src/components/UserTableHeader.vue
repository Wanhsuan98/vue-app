<template>
  <div
    class="hidden md:grid grid-cols-4 bg-gray-100 border-b border-gray-200 p-4 text-sm font-semibold text-gray-600"
  >
    <div
      v-for="col in columns"
      :key="col.key"
      class="flex cursor-pointer items-center gap-1 select-none hover:text-blue-600"
      @click="$emit('sort', col.key)"
    >
      {{ col.label }}
      <div class="flex flex-col items-center -space-y-1">
        <ChevronUpIcon
          class="h-3.5 w-3.5 transition-colors"
          :class="sortBy === col.key && order === 'asc' ? 'text-blue-600' : 'text-gray-300'"
        />
        <ChevronDownIcon
          class="h-3.5 w-3.5 transition-colors"
          :class="sortBy === col.key && order === 'desc' ? 'text-blue-600' : 'text-gray-300'"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/20/solid';

type SortKey = 'name' | 'position' | 'age' | 'location';

defineProps<{
  columns: { key: SortKey; label: string }[];
  sortBy?: string;
  order?: string;
}>();

defineEmits<{
  (e: 'sort', key: SortKey): void;
}>();
</script>
