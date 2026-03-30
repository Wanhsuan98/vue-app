<template>
  <header class="mb-4">
    <div class="flex w-full flex-col gap-3 md:w-1/2 md:flex-row">
      <div class="relative flex-1">
        <MagnifyingGlassIcon
          class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
        />
        <input
          :value="modelValue"
          type="text"
          aria-label="Search users by name, position, or location"
          placeholder="Search users..."
          class="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
          @input="onInput"
        />
      </div>
    </div>

    <div class="mt-3 flex items-center justify-between rounded-md bg-gray-50 p-2 md:hidden">
      <span class="text-sm font-medium text-gray-500">Sort by:</span>
      <select
        aria-label="Sort users"
        class="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
        @change="$emit('mobile-sort', $event)"
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
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';

defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'search'): void;
  (e: 'mobile-sort', event: Event): void;
}>();

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
  emit('search');
};
</script>
