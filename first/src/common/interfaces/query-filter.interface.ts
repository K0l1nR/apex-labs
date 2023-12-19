export interface QueryFilter<T> {
  query: string;
  filter: Partial<Record<keyof T, unknown>>;
}
