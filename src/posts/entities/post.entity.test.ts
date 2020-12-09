import { newPost } from '../domain/post';
import { PostEntity, PostEntityMapper } from './post.entity';

describe('post entity', () => {
  describe('PostEntityMapper', () => {
    const mapper = new PostEntityMapper();

    it('should map domain object to entity', () => {
      const result = newPost({ id: 'id' });
      expect(mapper.toEntity(result)).toBeInstanceOf(PostEntity);
    });

    it('should map entity to domain object', () => {
      const result = new PostEntity({ _id: '', body: '', owner: '', title: '' });
      expect(mapper.toDomain(result)).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
          owner: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });
});
