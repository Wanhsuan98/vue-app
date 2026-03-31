export interface User {
  id?: string;
  name: string;
  position: string;
  location: string;
  age: number;
  birthdate: string;
}

export interface QueryParams {
  q: string;
  sortBy: keyof User | '';
  order: 'asc' | 'desc';
  page: number;
  limit: number;
}
