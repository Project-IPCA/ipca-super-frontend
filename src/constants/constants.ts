export interface API_ERROR_RESPONSE {
  code: string | null;
  error: string | null;
}

export interface Pagination {
  page: number;
  pageSize: number;
  pages: number;
}
