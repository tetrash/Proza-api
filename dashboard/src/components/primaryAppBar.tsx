import React, { Component, MouseEvent } from 'react';
import { AppBar, Avatar, IconButton, Menu, MenuItem, Toolbar, Typography, withStyles } from '@material-ui/core';
import { config } from '../config';

const styles = () => ({
  title: {
    flexGrow: 1,
  },
});

interface NavbarProps {
  avatarUrl?: string;
  userName?: string;
  classes: any;
}

interface NavbarState {
  anchorEl: null | Element
}

class PrimaryAppBar extends Component<NavbarProps, NavbarState> {
  state = {
    anchorEl: null
  }

  handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleCloseUserMenu = () => {
    this.setState({ anchorEl: null });
  }

  handleLogout() {
    window.location.assign(`${config.backendDomain}/auth/logout?redirectTo=${config.dashboardDomain}/`);
  }

  render() {
    const isUserMenuOpen = this.state.anchorEl !== null;

    return <AppBar position="static" key={ this.props.userName }>
      <Toolbar>
        <Typography variant="h6" className={this.props.classes.title}>
          Proza-api admin dashboard
        </Typography>
        <IconButton onClick={this.handleOpenUserMenu}>
          <Avatar alt={this.props.userName} src={this.props.avatarUrl} />
        </IconButton>
        <Menu
          id="user-menu-appbar"
          anchorEl={this.state.anchorEl}
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
          onClose={this.handleCloseUserMenu}
        >
          <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>;
  }
}

export default withStyles(styles)(PrimaryAppBar)
