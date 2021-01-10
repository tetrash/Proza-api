import { Router } from 'express';
import { FsAdapter } from '../adapters/fs.adapter';
import { ServerMetadataService } from '../serverMetadata.service';
import { Config } from '../../common/config/config';

export const createServerMetadataRoute = async (config: Config): Promise<Router> => {
  const router = Router();

  const serverMetadataRepo = new FsAdapter();
  const serverMetadataService = new ServerMetadataService(serverMetadataRepo, config);

  const serverMetadata = await serverMetadataService.getServerMetadata();

  router.get('/metadata', (req, res) => {
    return res.json(serverMetadata);
  });

  return router;
};
