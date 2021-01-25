import { mock } from 'jest-mock-extended';
import { PostRepository } from './domain/repository';
import { PostCommentsService } from './postComments.service';

describe('Post comment service', () => {
  const postsRepo = mock<PostRepository>();
  const postCommentService = new PostCommentsService(postsRepo);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('commentPost', () => {
    it('should comment post', async () => {
      postsRepo.createPostComment.mockResolvedValue();
      postsRepo.generateId.mockReturnValue('id');
      const result = postCommentService.commentPost(
        { postId: 'postId', body: 'body' },
        { user: { id: 'str', role: 'admin' } as any },
      );
      await expect(result).resolves.toEqual(
        expect.objectContaining({
          id: 'id',
          body: 'body',
          post: 'postId',
          author: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });

  describe('respondToPostComment', () => {
    it('should respond to post comment', async () => {
      postsRepo.createPostComment.mockResolvedValue();
      postsRepo.generateId.mockReturnValue('id');
      const result = postCommentService.respondToPostComment(
        { postCommentId: 'commentId', body: 'body' },
        { user: { id: 'str', role: 'admin' } as any },
      );
      await expect(result).resolves.toEqual(
        expect.objectContaining({
          id: 'id',
          body: 'body',
          commentRef: 'commentId',
          author: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });

  describe('voteForPostComment', () => {
    it('should vote for post comment', async () => {
      postsRepo.createOrUpdatePostCommentVote.mockResolvedValue();
      const ctx = { user: { id: 'str', role: 'admin' } as any };
      await expect(postCommentService.voteForPostComment({ postCommentId: 'id', value: 1 }, ctx)).resolves.toBeTruthy();
      await expect(
        postCommentService.voteForPostComment({ postCommentId: 'id', value: -1 }, ctx),
      ).resolves.toBeTruthy();
    });
  });
});
