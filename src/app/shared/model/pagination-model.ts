export interface PaginationConfig<M> {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: M[];
  number: number;
  sort: Sort;
  pageable: Pageable;
  numberOfElements: number;
  empty: boolean;
}

export interface Sort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

export interface Pageable {
  offset: number;
  sort: Sort;
  paged: boolean;
  unpaged: boolean;
  pageNumber: number;
  pageSize: number;
}
