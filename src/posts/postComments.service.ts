import { Validate } from '../common/decorators/validate';
import { ServiceContext } from '../common/interfaces/serviceContext';
import { HasRole } from '../common/decorators/hasRole';
import { UserRole } from '../users/domain/user';
import { NotAuthenticatedError } from '../common/errors/errors';
import { PostRepository } from './domain/repository';
import { CommentPostDto } from './dto/commentPost.dto';
import { newPostComment, PostComment } from './domain/postComment';
import { VoteForPostCommentDto } from './dto/voteForPostComment.dto';
import { RespondToPostCommentDto } from './dto/respondToPostComment.dto';
import { DomainPaginationResult } from '../common/interfaces/domainPaginationResult';
import { ListPostCommentsDto } from './dto/listPostComments.dto';
import { GetCommentResponsesDto } from './dto/getCommentResponses.dto';

export class PostCommentsService {
  constructor(private readonly postRepo: PostRepository) {}

  @HasRole([UserRole.user, UserRole.admin, UserRole.moderator])
  @Validate(CommentPostDto)
  async commentPost(payload: CommentPostDto, ctx: ServiceContext): Promise<PostComment> {
    if (!ctx.user) {
      throw new NotAuthenticatedError();
    }

    const id = this.postRepo.generateId();
    const comment = newPostComment({ id, body: payload.body, post: payload.postId, author: ctx.user.id });
    await this.postRepo.createPostComment(comment);
    return comment;
  }

  @HasRole([UserRole.user, UserRole.admin, UserRole.moderator])
  @Validate(RespondToPostCommentDto)
  async respondToPostComment(payload: RespondToPostCommentDto, ctx: ServiceContext): Promise<PostComment> {
    if (!ctx.user) {
      throw new NotAuthenticatedError();
    }

    const id = this.postRepo.generateId();
    const comment = newPostComment({ id, body: payload.body, commentRef: payload.postCommentId, author: ctx.user.id });
    await this.postRepo.createPostComment(comment);
    return comment;
  }

  @HasRole([UserRole.user, UserRole.admin, UserRole.moderator])
  @Validate(VoteForPostCommentDto)
  async voteForPostComment(payload: VoteForPostCommentDto, ctx: ServiceContext): Promise<boolean> {
    if (!ctx.user) {
      throw new NotAuthenticatedError();
    }

    await this.postRepo.createOrUpdatePostCommentVote(payload.postCommentId, ctx.user.id, payload.value);
    return true;
  }

  @Validate(ListPostCommentsDto)
  async listPostComments(payload: ListPostCommentsDto): Promise<DomainPaginationResult<PostComment>> {
    return this.postRepo.listPostComments(payload.limit, payload.page, payload.query);
  }

  @Validate(GetCommentResponsesDto)
  async getCommentResponses(payload: GetCommentResponsesDto): Promise<PostComment[]> {
    return this.postRepo.getPostResponses(payload.postCommentId);
  }
}
