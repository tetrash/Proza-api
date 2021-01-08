import { PostsMongodbAdapter } from './postsMongodb.adapter';
import { PostEntity } from '../entities/post.entity';
import { getModelForClass } from '@typegoose/typegoose';
import { NotFoundError } from '../../common/errors/errors';
import { PaginateResult } from 'mongoose';
import { newPost, Post } from '../domain/post';

describe('posts mongodb adapter', () => {
  const postModel = getModelForClass(PostEntity);
  const adapter = new PostsMongodbAdapter(postModel);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPost', () => {
    it('should return post', async () => {
      const result = new PostEntity({ _id: 'id', body: 'body', author: 'owner', title: 'title' });
      jest.spyOn(postModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              lean: () => result,
            }),
          } as any),
      );
      await expect(adapter.getPost('')).resolves.toEqual(
        expect.objectContaining({
          id: 'id',
          title: 'title',
          body: 'body',
          author: 'owner',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });

    it('should throw InternalError if "findById" throws', async () => {
      jest.spyOn(postModel, 'findById').mockImplementation(() => {
        throw new Error();
      });
      await expect(adapter.getPost('')).rejects.toThrow();
    });

    it('should throw NotFoundError if no posts found', async () => {
      jest.spyOn(postModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => ({
              lean: () => null,
            }),
          } as any),
      );
      await expect(adapter.getPost('')).rejects.toThrow(NotFoundError);
    });
  });

  describe('listPosts', () => {
    it('should return posts', async () => {
      const result: PaginateResult<PostEntity> = {
        docs: [new PostEntity({ _id: '', body: '', author: '', title: '' })],
        totalDocs: 1,
        limit: 1,
        totalPages: 1,
        pagingCounter: 1,
        prevPage: null,
        nextPage: null,
        hasNextPage: false,
        hasPrevPage: false,
      };

      jest.spyOn(postModel, 'paginate').mockResolvedValue(result);
      await expect(adapter.listPosts(1, 1)).resolves.toHaveProperty('items');
      expect((await adapter.listPosts(1, 1)).items).toHaveLength(1);
    });

    it('should return empty array', async () => {
      jest.spyOn(postModel, 'paginate').mockResolvedValue(null as any);
      await expect(adapter.listPosts(1, 1)).resolves.toHaveProperty('items');
      expect((await adapter.listPosts(1, 1)).items).toHaveLength(0);
    });
  });

  describe('createPost', () => {
    it('should create post', async () => {
      const payload: Post = newPost({ id: 'id' });

      jest.spyOn(postModel, 'create').mockResolvedValue(undefined as any);
      await expect(adapter.createPost(payload)).resolves.not.toThrow();
      const { id, ...result } = payload;
      expect(postModel.create).toHaveBeenCalledWith({ ...result, _id: id });
    });
  });

  describe('deletePost', () => {
    it('should delete post', async () => {
      jest.spyOn(postModel, 'deleteOne').mockResolvedValue({});
      await expect(adapter.deletePost('id')).resolves.not.toThrow();
      expect(postModel.deleteOne).toHaveBeenCalledWith({ _id: 'id' });
    });
  });

  describe('updatePost', () => {
    it('should update post', async () => {
      const payload: Post = newPost({ id: 'id' });

      jest.spyOn(postModel, 'updateOne').mockResolvedValue({});
      await expect(adapter.updatePost(payload)).resolves.not.toThrow();
      const { id, ...result } = payload;
      expect(postModel.updateOne).toHaveBeenCalledWith({ _id: id }, { $set: result });
    });
  });

  describe('generateId', () => {
    it('should return id', () => {
      expect(adapter.generateId()).toEqual(expect.any(String));
    });
  });
});
