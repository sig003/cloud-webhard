import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useTranslation } from 'react-i18next';
import i18n from '../language/i18n';

function LanguageDialog(props:any) {
	const handleClickLanguage = (language:string) => {
		if (language !== 'etc') {
			i18n.changeLanguage(language);  
		} else {
			alert('It\'ll be soon');
		}
	}
	const useStyles = makeStyles((theme: Theme) => createStyles({
		root: {
			width: '100vw',
			maxWidth: 450,
			backgroundColor: theme.palette.background.paper,
			display: 'flex',
			justifyContent: 'space-between',
		},
		margin: {
			margin: theme.spacing(-1),
		},
		textField: {
			width: '40ch',
		},
		closeButton: {
			position: 'absolute',
			right: theme.spacing(1),
			top: theme.spacing(1),
			color: theme.palette.grey[500],
		}
	}));
	const classes = useStyles();

	const { t } = useTranslation();

	return (
		<Dialog
			open={props.languageOpen}
			onClose={props.handleClickLanguageClose}
	 		aria-labelledby="alert-dialog-title"
	 		aria-describedby="alert-dialog-description"
 		>
			<DialogTitle id="alert-dialog-title">{t('changeLanguage')}
				<IconButton aria-label="close" className={classes.closeButton} onClick={props.handleClickLanguageClose}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					<div className={classes.root}>
						<div>
							<List component="nav">
								<ListItem button>
									<ListItemText primary="한국어" onClick={() => handleClickLanguage('ko')}/>
								</ListItem>
							</List>
							<List component="nav">
								<ListItem button>
									<ListItemText primary="English (Austraila)" onClick={() => handleClickLanguage('etc')}/>
								</ListItem>
							</List>
							<List component="nav">
								<ListItem button>
									<ListItemText primary="English (Canada)" onClick={() => handleClickLanguage('etc')}/>
								</ListItem>
							</List>
						</div>
						<div>
						<List component="nav">
							<ListItem button>
								<ListItemText primary="English (US)" onClick={() => handleClickLanguage('en')}/>
							</ListItem>
						</List>
							<List component="nav">
								<ListItem button>
									<ListItemText primary="English (UK)" onClick={() => handleClickLanguage('etc')}/>
								</ListItem>
							</List>
							<List component="nav">
								<ListItem button>
									<ListItemText primary="Français" onClick={() => handleClickLanguage('etc')}/>
								</ListItem>
							</List>
						</div>
						<div>
							<List component="nav">
								<ListItem button>
									<ListItemText primary="日本語" onClick={() => handleClickLanguage('etc')}/>
								</ListItem>
							</List>
							<List component="nav">
								<ListItem button>
									<ListItemText primary="中文（简体）" onClick={() => handleClickLanguage('etc')}/>
								</ListItem>
							</List>
							<List component="nav">
								<ListItem button>
									<ListItemText primary="中文（繁體）" onClick={() => handleClickLanguage('etc')}/>
								</ListItem>
							</List>
						</div>
					</div>
				</DialogContentText>
			</DialogContent>
		</Dialog>
	);
};

export default LanguageDialog;