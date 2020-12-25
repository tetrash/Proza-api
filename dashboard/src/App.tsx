import React from 'react';
import './App.css';
import { useQuery } from '@apollo/client';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PrimaryNav from './components/primaryNav';
import PostsListPage from './pages/postsList.page';
import Loader from './components/loader';
import AccessDenied from './components/accessDenied';
import LoginPage from './pages/login.page';
import PrimaryAppBar from './components/primaryAppBar';
import { createStyles, CssBaseline, makeStyles, Theme, Toolbar } from '@material-ui/core';
import { GET_USER_DATA, GetUserData } from './graphql/queries';
import CreatePostPage from './pages/createPost.page';
import EditPostPage from './pages/editPost.page';
import DescriptionIcon from '@material-ui/icons/Description';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    root: {
      display: 'flex',
    },
  }),
);

const pages = [
  { url: '/post', name: 'Posts', icon: <DescriptionIcon /> },
]

export default function App() {
  const { loading, data, error } = useQuery<GetUserData, {}>(GET_USER_DATA);
  const classes = useStyles();

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <LoginPage />
  }

  if (data) {
    const hasRole = ['admin', 'moderator'].includes(data.me.role);
    if (!hasRole) {
      return <AccessDenied />
    }

    return (
      <div className={classes.root}>
        <BrowserRouter>
          <CssBaseline />
          <PrimaryAppBar userName={ data.me.username } avatarUrl={ data.me.avatarUrl } />
          <PrimaryNav pages={pages} />
          <Switch>
            <main className={classes.content}>
              <Toolbar />
              <Route path="/post" exact>
                <PostsListPage />
              </Route>
              <Route path="/post/new" exact>
                <CreatePostPage />
              </Route>
              <Route path="/post/edit/:id" exact>
                <EditPostPage />
              </Route>
            </main>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }

  return <AccessDenied />
}
