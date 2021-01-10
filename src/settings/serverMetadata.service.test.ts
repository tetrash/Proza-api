import { ServerMetadataService } from './serverMetadata.service';
import { mock } from 'jest-mock-extended';
import { ServerMetadataRepository } from './domain/repository';
import { Config } from '../common/config/config';
import { ServerMetadata } from './domain/serverMetadata';

describe('server metadata service', () => {
  const serverMetadataRepo = mock<ServerMetadataRepository>();
  const config = new Config();
  const service = new ServerMetadataService(serverMetadataRepo, config);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getServerMetadata', () => {
    it('should return server metadata', async () => {
      const apiVersion = '1.0.0';
      const expected: ServerMetadata = {
        apiVersion,
        enabledUserAuthMethods: expect.any(Array),
      };
      serverMetadataRepo.getServerVersion.mockResolvedValue(apiVersion);
      await expect(service.getServerMetadata()).resolves.toEqual(expected);
    });
  });
});
