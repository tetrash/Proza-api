import React, { MouseEvent, useState } from 'react';
import {
  AppBar,
  Avatar, createStyles,
  IconButton, makeStyles,
  Menu,
  MenuItem,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { config } from '../config';

interface NavbarProps {
  avatarUrl?: string;
  userName?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    title: {
      flexGrow: 1,
    },
  })
);

export default function PrimaryAppBar(props: NavbarProps) {
  const [ anchorEl, setAnchorEl ] = useState<null | Element>(null);
  const classes = useStyles();
  const isUserMenuOpen = anchorEl !== null;

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  }

  const handleLogout = () => {
    window.location.assign(`${config.backendDomain}/auth/logout?redirectTo=${config.dashboardDomain}/`);
  }

  return <AppBar position="fixed" className={classes.appBar}>
    <Toolbar>
      <Typography variant="h6" className={classes.title}>
        Proza-api admin dashboard
      </Typography>
      <IconButton onClick={handleOpenUserMenu}>
        <Avatar alt={props.userName} src={props.avatarUrl} />
      </IconButton>
      <Menu
        id="user-menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        getContentAnchorEl={null}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isUserMenuOpen}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Toolbar>
  </AppBar>
}
