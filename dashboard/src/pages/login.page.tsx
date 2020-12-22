import React, { Component } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import { config } from '../config';
import { Redirect } from 'react-router-dom';

export default class LoginPage extends Component<{ isLogged?: boolean }, {}>{
  handleGithubLogin() {
    window.location.assign(`${config.backendDomain}/auth/oauth2?redirectTo=${config.dashboardDomain}`)
  }

  render() {
    if (this.props.isLogged) {
      return <Redirect to='/' />
    }

    return <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: '100vh' }}
    >
      <Typography variant="h5">Proza admin dashboard - login</Typography>
      <Button
        variant="contained"
        style={{ backgroundColor: '#333333' }}
        color="primary"
        size="large"
        startIcon={<GitHubIcon />}
        onClick={this.handleGithubLogin}
      >
        Login with github
      </Button>
    </Grid>;
  }
}