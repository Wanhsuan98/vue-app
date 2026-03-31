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

    <div class="relative mt-3 md:hidden">
      <div
        @click="isDropdownOpen = !isDropdownOpen"
        class="flex items-center justify-between rounded-md bg-gray-50 p-3 border border-gray-200 cursor-pointer"
      >
        <span class="text-sm font-medium text-gray-500">Sort by:</span>
        <div class="flex items-center gap-2">
          <span class="text-base font-bold text-gray-800">{{ currentSortLabel }}</span>
          <ChevronDownIcon class="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div
        v-if="isDropdownOpen"
        class="absolute left-0 right-0 z-[110] mt-1 overflow-hidden rounded-md bg-white shadow-xl border border-gray-200"
      >
        <div
          v-for="(label, key) in sortOptions"
          :key="key"
          @click="selectOption(key)"
          class="px-4 py-4 text-lg font-semibold text-gray-700 hover:bg-sky-50 border-b border-gray-50 last:border-0"
        >
          {{ label }}
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/vue/24/outline';

defineProps<{
  modelValue: string;
}>();

const isDropdownOpen = ref(false);
const selectedValue = ref('');

const sortOptions = {
  '': 'Default (預設)',
  'name-asc': 'Name (A-Z)',
  'name-desc': 'Name (Z-A)',
  'age-asc': 'Age (Low-High)',
  'age-desc': 'Age (High-Low)',
};

const currentSortLabel = computed(
  () => sortOptions[selectedValue.value as keyof typeof sortOptions],
);

const selectOption = (key: string) => {
  selectedValue.value = key;
  isDropdownOpen.value = false;
  emit('mobile-sort', { target: { value: key } } as unknown as Event);
};

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
