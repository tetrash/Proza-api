import { Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles, Theme, Toolbar } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import React from 'react';

const drawerWidth = 240;

const styles = makeStyles((theme: Theme) => ({
  title: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  active: {
    backgroundColor: theme.palette.action.selected,
  },
}));

interface PrimaryNavProps {
  pages: { url: string; name: string; icon: any }[];
}

export default function PrimaryNav({ pages }: PrimaryNavProps) {
  const classes = styles();

  return (
    <div className={classes.drawerContainer}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <List>
          {pages.map((page) => (
            <ListItem button key={page.name} component={NavLink} to={page.url} exact activeClassName={classes.active}>
              <ListItemIcon>{page.icon}</ListItemIcon>
              <ListItemText primary={page.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
}
