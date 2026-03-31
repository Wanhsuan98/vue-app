import api from '@/apis/api';
import type { User, QueryParams } from '@/types';

export interface ListRes {
  data: User[];
  total: number;
  staticUser: User | null;
}

export const userApi = {
  getList(params: QueryParams, signal?: AbortSignal): Promise<ListRes> {
    return api.get<unknown, ListRes>('/users', {
      params,
      signal,
    });
  },

  create(data: User): Promise<{ success: boolean }> {
    return api.post<unknown, { success: boolean }>('/users', data);
  },

  update(id: string, data: User): Promise<{ success: boolean }> {
    return api.put<unknown, { success: boolean }>(`/users/${id}`, data);
  },

  remove(id: string): Promise<{ success: boolean }> {
    return api.delete<unknown, { success: boolean }>(`/users/${id}`);
  },
};
