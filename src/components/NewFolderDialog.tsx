import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import clsx from 'clsx';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';

interface NewFolderDialogProps {
	newFolderName: string;
	newFolderOpen: boolean;
	handleClickNewFolderClose: (handleClickNewFolderClose:boolean)=>void;
	handleClickNewFolder: ()=>void;
	handleNewFolderNameChange: (handleNewFolderNameChange:React.ChangeEvent<HTMLInputElement>)=>void;
}

function NewFolderDialog(props:any) {
	const useStyles = makeStyles((theme: Theme) => createStyles({
		newfolder_button: {
			background: '#1182DF',
			border: 'none',
			color: '#FFFFFF',
			'&:hover': {
				backgroundColor: '#088FFF',
				border: 'none',
				boxShadow: 'none',
			},
		},
		newfolder_cancel_button: {
			color:'#190707',
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
		  },
	}));
	const classes = useStyles();
	const { t } = useTranslation();

	return (
		<Dialog
			open={props.newFolderOpen}
			onClose={props.handleClickNewFolderClose}
	 		aria-labelledby="alert-dialog-title"
	 		aria-describedby="alert-dialog-description"
 		>
			<DialogTitle id="alert-dialog-title">{t('newFolder')}
				<IconButton aria-label="close" className={classes.closeButton} onClick={props.handleClickNewFolderClose}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					<FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
						<OutlinedInput
							id="outlined-adornment-weight"
							value={props.newFolderName}
							onChange={props.handleNewFolderNameChange}
						//	onFocus={props.handleRenameFocus}
							aria-describedby="outlined-weight-helper-text"
							labelWidth={0}
							placeholder={t('inputFolderName')}
							autoFocus
							color={props.chkNewFolderLength === true ? "secondary":"primary"}
						/>
					</FormControl>
				</DialogContentText>
				{props.chkNewFolderLength === true ? <Typography color="error">{t('createLimitFolderName')}</Typography>:""}
			</DialogContent>
			<DialogActions>
				<Button className={classes.newfolder_cancel_button} onClick={props.handleClickNewFolderClose} color="primary">{t('cancel')}</Button>
				{props.chkNewFolderLength === true ?
				<Button variant="outlined" disabled>{t('createNewFolder')}</Button> :
				<Button className={classes.newfolder_button} onClick={props.handleClickNewFolder} color="primary" variant="outlined">{t('createNewFolder')}</Button>}
			</DialogActions>
		</Dialog>
	);
};

export default NewFolderDialog;