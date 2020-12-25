import { useParams } from 'react-router-dom';
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_POST, GetPostResult } from '../graphql/queries';
import Loader from '../components/loader';
import PostForm from '../components/postForm';

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading } = useQuery<GetPostResult, { postId: string }>(GET_POST, { variables: { postId: id } });

  const handleSubmit = (e: any) => {
    console.log(e);
  };

  if (loading) {
    return <Loader />;
  }

  if (!data) {
    return <div />;
  }

  return <PostForm onSubmit={handleSubmit} initState={data.getPost} />;
}
