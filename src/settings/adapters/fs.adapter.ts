import { ServerMetadataRepository } from '../domain/repository';
import { readFile } from 'fs';
import { join } from 'path';

export class FsAdapter implements ServerMetadataRepository {
  getServerVersion(): Promise<string> {
    const path = join(__dirname, '../../../package.json');
    return new Promise<string>((resolve, reject) => {
      readFile(path, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
          return reject(err);
        }
        const packageJson = JSON.parse(data);
        return resolve(packageJson.version || '');
      });
    });
  }
}
