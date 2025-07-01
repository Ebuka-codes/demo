export interface PagingConfig {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface FilterOption {
  jobType: string;
  workMode: string;
  status: string;
  location: string;
  postedDateFilter: string;
}

export interface PostedDateOption {
  name: string;
  label: string;
}
export interface QueryOption {
  description: string;
  type: string;
}
