import React from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { config } from '../config';
import SocialLoginButton from '../components/socialLoginButton';

export default function LoginPage() {
  const handleGithubLogin = () => {
    window.location.assign(`${config.backendDomain}/auth/github?redirectTo=${config.dashboardDomain}`);
  };

  const handleOidcLogin = () => {
    window.location.assign(`${config.backendDomain}/auth/oidc?redirectTo=${config.dashboardDomain}`);
  };

  return (
    <Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{ minHeight: '100vh' }}>
      <Typography variant="h5">Proza admin dashboard - login</Typography>
      <SocialLoginButton
        onClick={handleGithubLogin}
        buttonText="Login with github"
        backgroundColor="#333333"
        color="white"
        icon={<GitHubIcon />}
        width="300px"
      />
      <SocialLoginButton
        onClick={handleOidcLogin}
        buttonText="Login with OIDC"
        backgroundColor="white"
        color="#333333"
        icon={<LockOpenIcon />}
        width="300px"
      />
    </Grid>
  );
}
