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

  const queryParams = ref<QueryParams>({
    q: '',
    sortBy: '',
    order: 'asc',
    page: 1,
    limit: 500,
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
      if (!isLoadMore) {
        staticUser.value = fetchedStaticUser || null;
      }
      if (isLoadMore) {
        users.value.push(...data);
      } else {
        users.value = data;
      }

      totalCount.value = total;
      hasMore.value = users.value.length < total;
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
    queryParams,
    fetchUsers,
    handleSearch,
    handleSort,
    loadNextPage,
  };
}
