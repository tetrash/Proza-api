export interface ServerMetadataRepository {
  getServerVersion(): Promise<string>;
}
