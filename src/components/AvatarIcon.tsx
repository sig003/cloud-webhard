import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { green } from '@material-ui/core/colors';

function AvatarIcon() {
	const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		'& > *': {
		margin: theme.spacing(1),
		width: theme.spacing(4),
		height: theme.spacing(4),
		},
	},
	green: {
		color: '#fff',
		backgroundColor: green[500],
	},
	}));

	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Avatar className={classes.green} src="http://10.52.5.200/test/images/RG.jpg"/>
		</div>
  );
};

export default AvatarIcon;

