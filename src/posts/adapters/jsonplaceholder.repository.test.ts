import { JsonplaceholderRepository } from './jsonplaceholder.repository';

describe('JsonplaceholderRepository', () => {
  describe('parsePost', () => {
    it('should parse response from jsonplaceholder', () => {
      JsonplaceholderRepository.parsePost({});
    });
  });
});
