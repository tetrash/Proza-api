import React, { Component } from 'react';
import './App.css';
import PrimaryAppBar from './components/primaryAppBar';
import { ApolloClient, ApolloProvider, createHttpLink, gql, InMemoryCache } from '@apollo/client';
import { CircularProgress, Grid, Typography } from '@material-ui/core';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import LoginPage from './pages/login.page';
import { config } from './config';

interface User { id: string, email?: string, username?: string, fullName?: string, avatarUrl?: string, role: string }

interface AppState {
  user?: User
  isLoading: boolean
}

const link = createHttpLink({
  uri: `${config.backendDomain}/graphql`,
  credentials: 'include'
});

class App extends Component<{}, AppState>{
  apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache()
  });

  state: AppState = {
    isLoading: true
  }

  async fetchUserData() {
    const result = await this.apolloClient.query<{ me: User }>({
      query: gql`
        query getMyData {
          me {
            id
            email
            username
            fullName
            avatarUrl
            role
          }
        }
      `
    });

    return result;
  }

  async componentDidMount() {
    try {
      const { data, loading } = await this.fetchUserData();
      this.setState({ user: data.me, isLoading: loading });
    } catch (e) {
      this.setState({ isLoading: false });
    }
  }

  loadApp() {
    if (this.state.isLoading) {
      return <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
      >
        <CircularProgress />
      </Grid>
    }

    const { user } = this.state;

    if (!user) {
      return <Redirect to="/login"/>
    }

    const hasRole = user && ['admin', 'moderator'].includes(user.role);
    if (!hasRole) {
      return <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
      >
        <Typography variant="h2">Access Denied!</Typography>
      </Grid>
    }
    return <PrimaryAppBar userName={ user.username } avatarUrl={ user.avatarUrl } />
  }

  render() {
    return (
      <div className="App">
        <ApolloProvider client={this.apolloClient}>
          <BrowserRouter>
            { this.loadApp() }
            <Switch>
              <Route path="/login">
                <LoginPage isLogged={!!this.state.user} />
              </Route>
            </Switch>
          </BrowserRouter>
        </ApolloProvider>
      </div>
    );
  }
}

export default App;
