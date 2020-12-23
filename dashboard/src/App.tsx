import React from 'react';
import './App.css';
import { useQuery } from '@apollo/client';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PrimaryNav from './components/primaryNav';
import PostsPage from './pages/posts.page';
import Loader from './components/loader';
import AccessDenied from './components/accessDenied';
import LoginPage from './pages/login.page';
import PrimaryAppBar from './components/primaryAppBar';
import { createStyles, CssBaseline, makeStyles, Theme, Toolbar } from '@material-ui/core';
import { GET_USER_DATA, GetUserData } from './graphql/queries';

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
          <PrimaryNav />
          <Switch>
            <main className={classes.content}>
              <Toolbar />
              <Route path="/posts">
                <PostsPage />
              </Route>
            </main>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }

  return <AccessDenied />
}
