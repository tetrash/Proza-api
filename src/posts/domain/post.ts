export class Post {
  constructor(payload: Partial<Post>) {
    Object.assign(this, payload);
  }

  id: number = 0;
  userId: number = 0;
  title: string = '';
  body: string = '';
}

export interface PostRepository {
  getPost(postId: number): Promise<Post>;
  listPosts(): Promise<Post[]>;
}
