import React from 'react';
import { useMutation } from '@apollo/client';
import { Redirect } from 'react-router-dom';
import Loader from '../components/loader';
import { CREATE_POST, CreatePostResult } from '../graphql/queries';
import PostForm from '../components/postForm';

export default function CreatePostPage() {
  const [createPost, { data, loading }] = useMutation<CreatePostResult, { title: string; body: string }>(CREATE_POST);

  if (loading) {
    return <Loader />;
  }

  if (data) {
    return <Redirect to={`/post/edit/${data.createPost.id}`} />;
  }

  const handleSubmit = (payload: { title: string; body: string }) => {
    return createPost({ variables: payload });
  };

  return <PostForm onSubmit={handleSubmit} />;
}
