import MockAdapter from 'axios-mock-adapter';
import api from '@/apis/api';
import type { User, QueryParams } from '@/types';

// 模擬打 API 的延遲
const mock = new MockAdapter(api, { delayResponse: 500 });

// 定義 mock database
let mockDatabase: User[] = Array.from({ length: 1000 }).map((_, i) => ({
  id: `u_${i}`,
  name: `User ${i}`,
  position: ['Frontend', 'Backend', 'Design', 'PM'][Math.floor(Math.random() * 4)],
  location: ['Taipei', 'Tokyo', 'New York'][Math.floor(Math.random() * 3)],
  age: 20 + Math.floor(Math.random() * 30),
  birthdate: new Date(1990 + Math.floor(Math.random() * 10), 0, 1).toISOString().split('T')[0],
}));

// 模擬一個特別要固定的資料
const STATIC_USER: User = {
  id: 'Leader_1',
  name: 'Jack',
  position: 'CTO',
  location: 'Taipei',
  age: 45,
  birthdate: '1981-03-30',
};
mockDatabase.push(STATIC_USER);

// --- 取得列表 ---
mock.onGet('/users').reply((config) => {
  const params = config.params as QueryParams;
  const { q = '', sortBy, order, page, limit } = params;
  const keyword = q.toLowerCase().trim();

  // 過濾
  const filtered = mockDatabase.filter((u) => {
    if (!keyword) return true;
    return (
      u.name.toLowerCase().includes(keyword) ||
      u.position.toLowerCase().includes(keyword) ||
      u.location.toLowerCase().includes(keyword) ||
      String(u.age).includes(keyword)
    );
  });

  const staticIndex = filtered.findIndex((u) => u.id === STATIC_USER.id);
  let returnedStaticUser = null;

  if (staticIndex > -1) {
    returnedStaticUser = filtered[staticIndex];
    // 從列表裡移除
    filtered.splice(staticIndex, 1);
  }

  // 排序
  if (sortBy) {
    filtered.sort((a, b) => {
      const valueA = a[sortBy as keyof User];
      const valueB = b[sortBy as keyof User];
      if (valueA === undefined || valueB === undefined) return 0;
      if (valueA < valueB) return order === 'asc' ? -1 : 1;
      if (valueA > valueB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // 分頁
  const start = (page - 1) * limit;
  const pagination = filtered.slice(start, start + limit);

  return [
    200,
    {
      data: pagination,
      total: filtered.length,
      staticUser: returnedStaticUser,
    },
  ];
});

// --- 新增 ---
mock.onPost('/users').reply((config) => {
  const data = JSON.parse(config.data);
  const newUser: User = {
    ...data,
    id: `u_${Date.now()}`, // 模擬後端產生唯一ID
  };
  mockDatabase.unshift(newUser);
  return [200, newUser];
});

// --- 編輯 ---
mock.onPut(/\/users\/.+/).reply((config) => {
  const id = config.url?.split('/').pop();
  const data = JSON.parse(config.data);

  const index = mockDatabase.findIndex((u) => u.id === id);
  if (index > -1) {
    mockDatabase[index] = { ...mockDatabase[index], ...data };
    return [200, mockDatabase[index]];
  }
  return [404, { message: 'User not found' }];
});

// --- 刪除 ---
mock.onDelete(/\/users\/u_\d+/).reply((config) => {
  const id = config.url?.split('/').pop();
  if (id) {
    mockDatabase = mockDatabase.filter((u) => u.id !== id);
    return [200, { success: true }];
  }
  return [400, { message: 'Bad Request' }];
});
