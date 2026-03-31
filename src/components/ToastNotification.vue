<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-[-20px] opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed top-5 left-1/2 z-[100] -translate-x-1/2 flex items-center gap-3 rounded-lg px-6 py-3 shadow-lg"
      :class="type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'"
    >
      <CheckCircleIcon v-if="type === 'success'" class="h-5 w-5" />
      <ExclamationTriangleIcon v-else class="h-5 w-5" />

      <span class="text-sm font-medium">{{ message }}</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

defineProps<{
  show: boolean;
  message: string;
  type: 'success' | 'error';
}>();
</script>
