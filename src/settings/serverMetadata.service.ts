import { ServerMetadataRepository } from './domain/repository';
import { ServerMetadata } from './domain/serverMetadata';
import { Config } from '../common/config/config';

export class ServerMetadataService {
  constructor(private readonly serverMetadataRepo: ServerMetadataRepository, private readonly config: Config) {}

  async getServerMetadata(): Promise<ServerMetadata> {
    const apiVersion = await this.serverMetadataRepo.getServerVersion();
    return {
      enabledUserAuthMethods: this.config.auth.type,
      apiVersion,
    };
  }
}
