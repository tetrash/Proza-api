import React from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import { config } from '../config';

export default function LoginPage() {
  const handleGithubLogin = () => {
    window.location.assign(`${config.backendDomain}/auth/oauth2?redirectTo=${config.dashboardDomain}`);
  };

  return (
    <Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{ minHeight: '100vh' }}>
      <Typography variant="h5">Proza admin dashboard - login</Typography>
      <Button
        variant="contained"
        style={{ backgroundColor: '#333333' }}
        color="primary"
        size="large"
        startIcon={<GitHubIcon />}
        onClick={handleGithubLogin}
      >
        Login with github
      </Button>
    </Grid>
  );
}
