import { useParams } from 'react-router-dom';
import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_POST, GetPostResult } from '../graphql/post.queries';
import Loader from '../components/loader';
import PostForm from '../components/postForm';
import { UPDATE_POST, UpdatePostInput, UpdatePostResult } from '../graphql/post.mutations';

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading } = useQuery<GetPostResult, { postId: string }>(GET_POST, {
    variables: { postId: id },
    fetchPolicy: 'no-cache',
  });
  const [updatePost] = useMutation<UpdatePostResult, UpdatePostInput>(UPDATE_POST);

  const handleSubmit = (payload: { title: string; body: string }): unknown => {
    return updatePost({ variables: { ...payload, postId: id } });
  };

  if (loading) {
    return <Loader />;
  }

  if (!data) {
    return <div />;
  }

  return <PostForm onSubmit={handleSubmit} initState={data.getPost} />;
}
