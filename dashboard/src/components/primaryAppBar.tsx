import React, { MouseEvent, useState } from 'react';
import {
  AppBar,
  Avatar,
  createStyles,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { Link } from 'react-router-dom';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
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
  }),
);

export default function PrimaryAppBar({ userName, avatarUrl }: NavbarProps) {
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const classes = useStyles();
  const isUserMenuOpen = anchorEl !== null;

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    window.location.assign(`${config.backendDomain}/auth/logout?redirectTo=${config.dashboardDomain}/`);
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Proza-api admin dashboard
        </Typography>
        <IconButton onClick={handleOpenUserMenu}>
          <Avatar alt={userName} src={avatarUrl} />
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
          <MenuItem component={Link} to="/post/new" onClick={handleCloseUserMenu}>
            <ListItemIcon>
              <NoteAddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="New post" />
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <PowerSettingsNewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
