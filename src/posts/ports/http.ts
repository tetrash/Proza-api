import { Router } from 'express';
import { JsonplaceholderRepository } from '../adapters/jsonplaceholder.repository';
import { PostsService } from '../posts.service';
import { Post } from '../domain/post';

const postsRepository = new JsonplaceholderRepository();
const postService = new PostsService(postsRepository);

const router = Router();

router.get('/:postId', async (req, res, next) => {
  try {
    const { postId } = req.params;
    const result = await postService.getPost({ postId: Number(postId) });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { postId } = req.query;
    let result: Post[];
    if (postId) {
      const post = await postService.getPost({ postId: Number(postId) });
      result = [post];
    } else {
      result = await postService.listPosts();
    }
    res.json(result);
  } catch (e) {
    next(e);
  }
});

export const postsRouter = router;
