import { Grid, Typography } from '@material-ui/core';
import React from 'react';

export default function AccessDenied() {
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