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
          aria-label="Search users"
          placeholder="Search users..."
          class="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-sky-500 focus:outline-none"
          @input="onInput"
        />
      </div>

      <button
        @click="$emit('open-modal')"
        class="flex items-center justify-center gap-2 rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 transition-colors duration-300 ease-in-out md:ml-2"
      >
        Add
        <PlusIcon class="h-5 w-5" />
      </button>
    </div>

    <div class="mt-3 flex items-center justify-between rounded-md bg-gray-50 p-2 md:hidden"></div>
  </header>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/vue/24/outline';

defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'search'): void;
  (e: 'mobile-sort', event: Event): void;
  (e: 'open-modal'): void;
}>();

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
  emit('search');
};
</script>
