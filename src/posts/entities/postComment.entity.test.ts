import { PostCommentEntity, PostCommentEntityMapper } from './postComment.entity';
import { newPostComment, PostCommentStatus } from '../domain/postComment';

describe('post comment entity', () => {
  describe('PostEntityMapper', () => {
    const mapper = new PostCommentEntityMapper();

    it('should map domain object to entity', () => {
      const result = newPostComment({ id: 'id', body: 'body', author: 'author', post: 'post' });
      expect(mapper.toEntity(result)).toBeInstanceOf(PostCommentEntity);
    });

    it('should map entity to domain object', () => {
      const result = new PostCommentEntity({
        _id: '',
        body: '',
        author: '',
        responses: [],
        status: PostCommentStatus.ok,
      });
      expect(() => mapper.toDomain(result)).not.toThrow();
    });
  });
});
