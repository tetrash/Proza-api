export interface DomainPaginationResult<Domain> {
  items: Domain[];
  nextPage: number | null;
  previousPage: number | null;
  page: number;
  totalPages: number;
  totalItems: number;
}
