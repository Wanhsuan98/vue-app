<template>
  <div
    class="relative flex flex-col gap-0.5 p-2 border-b border-gray-100 transition-colors h-[96px] overflow-hidden md:grid md:grid-cols-5 md:items-center md:gap-4 md:p-4 md:h-[72px]"
    :class="[isStatic ? 'bg-sky-50 hover:bg-sky-100' : 'bg-white hover:bg-gray-50']"
  >
    <div
      v-for="field in listFields"
      :key="field.key"
      class="text-sm truncate"
      :class="field.customClass"
    >
      <span class="md:hidden text-gray-400 text-xs mr-2">{{ field.label }}:</span>
      {{ user[field.key] }}
    </div>

    <div class="absolute right-3 top-3 flex gap-3 md:static md:col-span-1 md:justify-end">
      <button
        @click="$emit('edit', user)"
        class="text-gray-400 hover:text-sky-600 focus:outline-none"
        aria-label="Edit"
      >
        <PencilSquareIcon class="h-5 w-5" />
      </button>
      <button
        @click="$emit('delete', user.id!)"
        class="text-gray-400 hover:text-red-600 focus:outline-none"
        aria-label="Delete"
      >
        <TrashIcon class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types';
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline';

defineProps<{
  user: User;
  isStatic: boolean;
}>();

defineEmits<{
  (e: 'edit', user: User): void;
  (e: 'delete', id: string): void;
}>();

const listFields: { key: keyof User; label: string; customClass: string }[] = [
  { key: 'name', label: 'Name', customClass: 'font-medium text-gray-900 pr-16 md:pr-0' },
  { key: 'position', label: 'Position', customClass: 'text-gray-600' },
  { key: 'age', label: 'Age', customClass: 'text-gray-600' },
  { key: 'location', label: 'Location', customClass: 'text-gray-600' },
];
</script>
