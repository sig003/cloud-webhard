import React, { useState, useEffect } from 'react';
import { setLogout } from '../api/Auth';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import {RouteComponentProps} from "react-router-dom";
import Button from '@material-ui/core/Button';

type Icon<ItemType> = {
	component: RouteComponentProps;
	setShowRightRegion: (showRightRegion:boolean)=>void;
};
type Anchor = 'top' | 'left' | 'bottom' | 'right';

function AvatarRightRegion<ItemType>(props:Icon<ItemType>) {
	const useStyles = makeStyles({
		list: {
		  width: 250,
		  textAlign: 'center',
		  marginTop: '10px',
		},
		fullList: {
		  width: 'auto',
		},
  });
	const classes = useStyles();
	const [state, setState] = useState({
	  top: false,
	  left: false,
	  bottom: false,
	  right: false,
	});
	const handleLogout = () => {
		setLogout();
		props.component.history.push('/login');
	}

	const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent)  => {
	  if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
		return;
	  }
  
	  setState({ ...state, [anchor]: open });

	  props.setShowRightRegion(false);
	};
	
	const list = (anchor: Anchor) => (
		<div
		  className={clsx(classes.list, {
			[classes.fullList]: anchor === 'top' || anchor === 'bottom',
		  })}
		  role="presentation"
		  onClick={(event: React.MouseEvent<HTMLElement>)=>{toggleDrawer(anchor, false)}}
		  onKeyDown={toggleDrawer(anchor, false)}
		>
			<Button onClick={handleLogout}>로그아웃</Button>
		</div>
	  );

	useEffect(() => {
		setState({ ...state, ['right']: true });
	  },[]);
	  
	return (
		<div>
		  <React.Fragment>
			<Drawer BackdropProps={{ invisible: true }}  anchor='right' open={state['right']} onClose={toggleDrawer('right', false)}>
			  {list('right')}
			</Drawer>
		  </React.Fragment>
	  	</div>
	);
};

export default AvatarRightRegion;