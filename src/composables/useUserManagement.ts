import { ref } from 'vue';
import axios from 'axios';
import { userApi } from '@/apis/userApi';
import type { User, QueryParams } from '@/types';
import { debounce } from '@/utils/debounce';

export function useUserManagement() {
  // --- refs ---
  const users = ref<User[]>([]);
  const staticUser = ref<User | null>(null);
  const isLoading = ref(false);
  const isError = ref<string | null>(null);
  const totalCount = ref(0);
  const hasMore = ref(true);

  // edit modal
  const isModalOpen = ref(false);
  const isEditing = ref(false);
  const editingId = ref<string | null>(null);

  // delete modal
  const isdelModalOpen = ref(false);
  const delId = ref<string | null>(null);
  const isDeletedPermanently = ref(false);

  // toast
  type ToastType = 'success' | 'error';
  const toastMessage = ref('');
  const toastType = ref<ToastType>('success');
  const showToast = ref(false);

  let toastTimer: number | null = null;

  const queryParams = ref<QueryParams>({
    q: '',
    sortBy: '',
    order: 'asc',
    page: 1,
    limit: 500,
  });

  const formData = ref<User>({
    name: '',
    position: '',
    location: '',
    age: 0,
    birthdate: '',
  });

  let abortController: AbortController | null = null;

  // --- fetch data ---
  const fetchUsers = async (isLoadMore = false) => {
    if (abortController) {
      abortController.abort();
    }

    abortController = new AbortController();

    isLoading.value = true;
    isError.value = null;

    try {
      const {
        data,
        total,
        staticUser: fetchedStaticUser,
      } = await userApi.getList(queryParams.value, abortController.signal);
      if (!isDeletedPermanently.value && !isLoadMore) {
        staticUser.value = fetchedStaticUser || null;
      }
      if (isLoadMore) {
        users.value.push(...data);
      } else {
        users.value = data;
      }

      totalCount.value = total;

      const totalPages = Math.ceil(total / queryParams.value.limit);
      hasMore.value = queryParams.value.page < totalPages && data.length > 0;
    } catch (err: unknown) {
      if (axios.isCancel(err)) {
        return;
      }
      const error = err as Error;
      isError.value = error.message || '無法獲取使用者資料';
      console.error('[Fetch Users Error]:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // 防抖
  const handleSearch = debounce((q: string) => {
    queryParams.value.q = q;
    queryParams.value.page = 1;
    fetchUsers(false);
  }, 300);

  const handleSort = (field: keyof User) => {
    if (queryParams.value.sortBy === field) {
      queryParams.value.order = queryParams.value.order === 'asc' ? 'desc' : 'asc';
    } else {
      queryParams.value.sortBy = field;
      queryParams.value.order = 'asc';
    }
    queryParams.value.page = 1;
    fetchUsers(false);
  };

  const triggerDeleteModal = (id: string) => {
    delId.value = id;
    isdelModalOpen.value = true;
  };

  const handleDelete = async () => {
    if (!delId.value) return;
    const targetId = delId.value;
    isdelModalOpen.value = false;

    try {
      if (delId.value === 'Leader_1') {
        staticUser.value = null;
        isDeletedPermanently.value = true;
      }

      await userApi.remove(targetId);
      triggerToast(`User ${targetId} deleted successfully`);

      queryParams.value.page = 1;
      await fetchUsers();
    } catch (error) {
      triggerToast('Delete failed', 'error');
      if (targetId === 'Leader_1') {
        isDeletedPermanently.value = false;
        await fetchUsers();
      }
      console.error('Delete failed', error);
    } finally {
      delId.value = null;
    }
  };

  const closeDelModal = () => {
    isdelModalOpen.value = false;
    delId.value = null;
  };

  const openModal = (user?: User) => {
    if (user) {
      isEditing.value = true;
      editingId.value = user.id ?? null;
      Object.assign(formData.value, {
        name: user.name,
        position: user.position,
        age: user.age,
        location: user.location,
        birthdate: user.birthdate,
      });
    } else {
      isEditing.value = false;
      editingId.value = null;
      Object.assign(formData.value, {
        name: '',
        position: '',
        location: '',
        age: 0,
        birthdate: '',
      });
    }
    isModalOpen.value = true;
  };

  const saveUser = async (userData?: User) => {
    const dataToSave = userData || formData.value;
    try {
      if (isEditing.value && editingId.value) {
        await userApi.update(editingId.value, dataToSave);
        triggerToast(`User ${editingId.value} updated successfully`);
      } else {
        await userApi.create(dataToSave);
        triggerToast(`User ${dataToSave.name} created successfully`);
      }
      isModalOpen.value = false;
      queryParams.value.page = 1;
      fetchUsers();
    } catch (error) {
      console.error('Save failed', error);
    }
  };

  const closeModal = () => {
    isModalOpen.value = false;
  };

  const triggerToast = (msg: string, type: ToastType = 'success') => {
    toastMessage.value = msg;
    toastType.value = type;
    showToast.value = true;

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      showToast.value = false;
    }, 3000); // 3秒後自動消失
  };
  const loadNextPage = () => {
    if (isLoading.value || !hasMore.value) return;
    queryParams.value.page += 1;
    fetchUsers(true);
  };

  return {
    users,
    staticUser,
    isLoading,
    isError,
    totalCount,
    hasMore,
    isModalOpen,
    isEditing,
    formData,
    queryParams,
    fetchUsers,
    handleSearch,
    handleSort,
    handleDelete,
    openModal,
    saveUser,
    closeModal,
    loadNextPage,
    closeDelModal,
    isdelModalOpen,
    triggerDeleteModal,
    toastMessage,
    toastType,
    showToast,
  };
}
