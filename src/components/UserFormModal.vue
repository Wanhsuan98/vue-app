<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity"
  >
    <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
      <h3 class="mb-4 text-lg font-bold text-gray-900">
        {{ isEditing ? 'Edit User' : 'Add New User' }}
      </h3>

      <form @submit.prevent="handleSave" class="flex flex-col gap-4">
        <div v-for="field in formFields" :key="field.key" :class="field.span">
          <label :for="field.key" class="block text-sm font-medium text-gray-700">
            {{ field.label }}
          </label>
          <input
            :id="field.key"
            v-model="localFormData[field.key]"
            :type="field.type"
            required
            class="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            @click="$emit('close')"
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 ease-in-out hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 ease-in-out hover:bg-sky-700 focus:outline-none"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { User } from '@/types';

const props = defineProps<{
  isOpen: boolean;
  isEditing: boolean;
  formData: User;
}>();

type FormField = {
  key: keyof User;
  label: string;
  type: string;
  span: string;
};

const formFields: FormField[] = [
  { key: 'name', label: 'Name', type: 'text', span: 'col-span-2' },
  { key: 'position', label: 'Position', type: 'text', span: 'col-span-2' },
  { key: 'age', label: 'Age', type: 'number', span: 'col-span-1' },
  { key: 'birthdate', label: 'Birthdate', type: 'date', span: 'col-span-1' },
  { key: 'location', label: 'Location', type: 'text', span: 'col-span-2' },
];

const localFormData = reactive<User>({ ...props.formData });

watch(
  () => props.formData,
  (newVal) => {
    Object.assign(localFormData, newVal);
  },
  { deep: true, immediate: true },
);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', userData: User): void;
}>();

const handleSave = () => {
  emit('save', { ...localFormData });
};
</script>
