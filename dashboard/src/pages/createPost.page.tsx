import React from 'react';
import { useMutation } from '@apollo/client';
import { Redirect } from 'react-router-dom';
import Loader from '../components/loader';
import PostsForm from '../components/postsForm';
import { CREATE_POST, CreatePostInput, CreatePostResult } from '../graphql/post.mutations';

export default function CreatePostPage() {
  const [createPost, { data, loading }] = useMutation<CreatePostResult, CreatePostInput>(CREATE_POST);

  if (loading) {
    return <Loader />;
  }

  if (data) {
    return <Redirect to={`/post/edit/${data.createPost.id}`} />;
  }

  const handleSubmit = (payload: { title: string; body: string }) => {
    return createPost({ variables: payload });
  };

  return <PostsForm onSubmit={handleSubmit} />;
}
