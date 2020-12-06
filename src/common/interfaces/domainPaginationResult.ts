export interface DomainPaginationResult<Domain> {
  items: Domain[];
  nextToken?: string;
}
