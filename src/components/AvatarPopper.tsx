import React, { useState, useEffect } from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {RouteComponentProps} from "react-router-dom";
import { setLogout, getUserType } from '../api/Auth';
import { useTranslation } from 'react-i18next';

type Icon<ItemType> = {
	component: RouteComponentProps;
	setShowAvatarPopper: (showAvatarPopper:boolean)=>void;
	showAvatarPopper: boolean;
	anchorRef: any;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    paper: {
	  marginRight: theme.spacing(2),
    },
  }),
);

function AvatarPopper<ItemType>(props:Icon<ItemType>) {
  const classes = useStyles();
  const [open, setOpen] = useState(props.showAvatarPopper);
  const userType = getUserType();
  const { t } = useTranslation();

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (props.anchorRef.current && props.anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  const handleLogout = () => {
		setLogout();
		props.component.history.push('/login');
  }
  
  const handleProfile = () => {
    setOpen(false);
    props.setShowAvatarPopper(false);
    window.location.href = '/user';
    
  }
  
  const handleAdmin = () => {
    setOpen(false);
    props.setShowAvatarPopper(false);
    window.location.href = '/admin';
  }

  useEffect(() => {
    return () => {
      setOpen(false);
      props.setShowAvatarPopper(false);
    }
  },[open]);

  return (
    <div className={classes.root}>
      <div>
        <Popper open={open} anchorEl={props.anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <MenuItem onClick={handleProfile}>{t('userProfile')}</MenuItem>
                    {userType === "admin" && <MenuItem onClick={handleAdmin}>{t('modifyAdmin')}</MenuItem>}
                    <MenuItem onClick={handleLogout}>{t('logout')}</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
}

export default AvatarPopper;