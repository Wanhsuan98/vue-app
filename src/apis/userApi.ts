import api from '@/apis/api';
import type { User, QueryParams } from '@/types';

export interface ListRes {
  data: User[];
  total: number;
}

export const userApi = {
  getList(params: QueryParams, signal?: AbortSignal): Promise<ListRes> {
    return api.get<unknown, ListRes>('/users', {
      params,
      signal,
    });
  },

  remove(id: string): Promise<{ success: boolean }> {
    return api.delete<unknown, { success: boolean }>(`/users/${id}`);
  },
};
