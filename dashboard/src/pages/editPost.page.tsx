import { Redirect, useParams } from 'react-router-dom';
import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_POST, GetPostResult } from '../graphql/post.queries';
import Loader from '../components/loader';
import PostsForm from '../components/postsForm';
import {
  DELETE_POST,
  DeletePostInput,
  DeletePostResult,
  UPDATE_POST,
  UpdatePostInput,
  UpdatePostResult,
} from '../graphql/post.mutations';

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading } = useQuery<GetPostResult, { postId: string }>(GET_POST, {
    variables: { postId: id },
    fetchPolicy: 'no-cache',
  });
  const [updatePost] = useMutation<UpdatePostResult, UpdatePostInput>(UPDATE_POST);
  const [deletePost, deletePostHooks] = useMutation<DeletePostResult, DeletePostInput>(DELETE_POST);

  if (deletePostHooks.data) {
    return <Redirect to="/post" />;
  }

  const handleSubmit = (payload: { title: string; body: string }): unknown => {
    return updatePost({ variables: { ...payload, postId: id } });
  };

  const handlePostDeletion = async () => {
    await deletePost({ variables: { postId: id } });
  };

  if (loading) {
    return <Loader />;
  }

  if (!data) {
    return <div />;
  }

  return <PostsForm onSubmit={handleSubmit} initState={data.getPost} allowDelete onDelete={handlePostDeletion} />;
}
