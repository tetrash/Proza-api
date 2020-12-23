import { CircularProgress, Grid } from '@material-ui/core';
import React from 'react';

export default function Loader() {
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