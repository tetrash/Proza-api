import { MongodbAdapter } from './mongodb.adapter';
import { PostEntity } from '../entities/post.entity';
import { getModelForClass } from '@typegoose/typegoose';
import { InternalError, NotFoundError } from '../../common/errors/errors';
import { PaginateResult } from 'mongoose';
import { newPost, Post } from '../domain/post';

describe('posts mongodb adapter', () => {
  const postModel = getModelForClass(PostEntity);
  const adapter = new MongodbAdapter(postModel);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPost', () => {
    it('should return post', async () => {
      const result = new PostEntity({});
      jest.spyOn(postModel, 'findById').mockReturnValue(result as any);
      await expect(adapter.getPost('')).resolves.toEqual(
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

    it('should throw InternalError if "findById" throws', async () => {
      jest.spyOn(postModel, 'findById').mockImplementation(() => {
        throw new Error();
      });
      await expect(adapter.getPost('')).rejects.toThrow(InternalError);
    });

    it('should throw NotFoundError if no posts found', async () => {
      jest.spyOn(postModel, 'findById').mockReturnValue(null as any);
      await expect(adapter.getPost('')).rejects.toThrow(NotFoundError);
    });
  });

  describe('listPosts', () => {
    it('should return posts', async () => {
      const result: PaginateResult<PostEntity> = {
        docs: [new PostEntity({})],
        totalDocs: 1,
        limit: 1,
        totalPages: 1,
        pagingCounter: 1,
        prevPage: null,
        nextPage: null,
        hasNextPage: false,
        hasPrevPage: false,
      };

      jest.spyOn(postModel, 'paginate').mockReturnValue(Promise.resolve(result));
      await expect(adapter.listPosts(1, '1')).resolves.toHaveProperty('items');
      expect((await adapter.listPosts(1)).items).toHaveLength(1);
    });

    it('should return empty array', async () => {
      jest.spyOn(postModel, 'paginate').mockReturnValue(Promise.resolve(null as any));
      await expect(adapter.listPosts(1)).resolves.toHaveProperty('items');
      expect((await adapter.listPosts(1)).items).toHaveLength(0);
    });
  });

  describe('createPost', () => {
    it('should create post', async () => {
      const payload: Post = newPost({});

      jest.spyOn(postModel, 'create').mockReturnValue(Promise.resolve(undefined) as any);
      await expect(adapter.createPost(payload)).resolves.not.toThrow();
      const { id, ...result } = payload;
      expect(postModel.create).toHaveBeenCalledWith({ ...result, _id: id });
    });
  });

  describe('generateId', () => {
    it('should return id', () => {
      expect(adapter.generateId()).toEqual(expect.any(String));
    });
  });
});
