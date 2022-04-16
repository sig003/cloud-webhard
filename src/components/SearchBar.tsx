import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { useTranslation } from "react-i18next";

function SearchBar() {
	const useStyles = makeStyles((theme) => ({
		search: {
		  position: 'relative',
		  borderRadius: theme.shape.borderRadius,
		  backgroundColor: fade(theme.palette.common.white, 0.15),
		  '&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		  },
		  marginLeft: 0,
		  width: '100%',
		  [theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(1), //해당 숫자를 늘리면 아이템이 우측으로 밀려남. 브라우저 width를 줄이면 이 부분 때문에 디자인이 꺠짐
			width: 'auto',
		  },
		},
		searchIcon: {
		  padding: theme.spacing(0, 2),
		  height: '100%',
		  position: 'absolute',
		  pointerEvents: 'none',
		  display: 'flex',
		  alignItems: 'center',
		  justifyContent: 'center',
		},
		inputRoot: {
		  color: 'inherit',
		},
		inputInput: {
		  padding: theme.spacing(1, 1, 1, 0),
		  // vertical padding + font size from searchIcon
		  paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		  transition: theme.transitions.create('width'),
		  width: '100%',
		  [theme.breakpoints.up('sm')]: {
			width: '42ch', //아이템 사이즈를 늘임
			'&:focus': {
			  width: '52ch', //포커스가 갔을때 아이템 사이즈를 늘임
			},
		  },
		},
	  }));

	const classes = useStyles();
	const { t } = useTranslation();

	return (
		<Toolbar variant="dense">
			<div className={classes.search} style={{fontSize:'0px'}}>
				<div className={classes.searchIcon}>
					<SearchIcon />
				</div>
				<div>
				<InputBase
					placeholder={t('search')}
					classes={{
						root: classes.inputRoot,
						input: classes.inputInput,
					}}
					inputProps={{ 'aria-label': 'search' }}
				/>
				</div>
			</div>
		</Toolbar>
	);
};

export default SearchBar