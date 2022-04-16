import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { useTranslation } from "react-i18next";

function PermanentDeleteDialog(props:any) {
	const useStyles = makeStyles((theme: Theme) => createStyles({
		clear_button: {
			background: '#1182DF',
			border: 'none',
			color: '#FFFFFF',
			'&:hover': {
				backgroundColor: '#088FFF',
				border: 'none',
				boxShadow: 'none',
			},
		},
		clear_cancel_button: {
			color:'#190707',
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
			open={props.permanentDeleteOpen}
			onClose={props.handlePermanentDeleteClose}
	 		aria-labelledby="alert-dialog-title"
	 		aria-describedby="alert-dialog-description"
 		>
			<DialogTitle id="alert-dialog-title">{t('permanentDelete')}
				<IconButton aria-label="close" className={classes.closeButton} onClick={props.handlePermanentDeleteClose}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{t('permanentDeleteMessage')}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button className={classes.clear_cancel_button} onClick={props.handlePermanentDeleteClose} color="primary">{t('cancel')}</Button>
				<Button className={classes.clear_button} onClick={props.handleSetPermanentDelete} color="primary" variant="outlined">{t('delete')}</Button>
			</DialogActions>
		</Dialog>
	);
}

export default PermanentDeleteDialog;