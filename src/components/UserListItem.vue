<template>
  <div
    class="flex flex-col gap-1 p-2 border-b border-gray-100 transition-colors hover:bg-gray-50 h-[96px] overflow-hidden md:grid md:grid-cols-4 md:items-center md:gap-4 md:p-4"
  >
    <div class="text-sm font-medium text-gray-900 truncate">
      <span class="md:hidden text-gray-400 text-xs mr-2">Name:</span>
      {{ user.name }}
    </div>
    <div class="text-sm text-gray-600 truncate">
      <span class="md:hidden text-gray-400 text-xs mr-2">Position:</span>
      {{ user.position }}
    </div>
    <div class="text-sm text-gray-600 truncate">
      <span class="md:hidden text-gray-400 text-xs mr-2">Age:</span>
      {{ user.age }}
    </div>
    <div class="text-sm text-gray-600 truncate">
      <span class="md:hidden text-gray-400 text-xs mr-2">Location:</span>
      {{ user.location }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types';

defineProps<{
  user: User;
}>();

defineEmits<{
  (e: 'edit', user: User): void;
  (e: 'delete', id: string): void;
}>();
</script>
