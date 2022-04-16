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
import { useTranslation } from "react-i18next";

interface RenameDialogProps {
	rename: string;
	renameOpen: boolean;
	handleClickRenameClose: (handleClickRenameClose:boolean)=>void;
	handleRenameFocus: (handleRenameFocus:React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>)=>void;
	handleClickRename: ()=>void;
	handleRenameChange: (handleRenameChange:React.ChangeEvent<HTMLInputElement>)=>void;
}

function RenameUserDialog(props:any) {
	const useStyles = makeStyles((theme: Theme) => createStyles({
		rename_button: {
			background: '#1182DF',
			border: 'none',
			color: '#FFFFFF',
			'&:hover': {
				backgroundColor: '#088FFF',
				border: 'none',
				boxShadow: 'none',
			},
		},
		rename_cancel_button: {
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
		dialogText: {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
		}
	}));
	const classes = useStyles();
	const { t } = useTranslation();

	return (
		<Dialog
			open={props.renameUserOpen}
			onClose={props.handleClickRenameUserClose}
	 		aria-labelledby="alert-dialog-title"
	 		aria-describedby="alert-dialog-description"
 		>
			<DialogTitle id="alert-dialog-title">{t('renameUser')}
				<IconButton aria-label="close" className={classes.closeButton} onClick={props.handleClickRenameUserClose}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					<FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
						<div className={classes.dialogText}>
							<OutlinedInput
								id="outlined-adornment-weight"
								value={props.rename}
								onChange={props.handleRenameUserChange}
								aria-describedby="outlined-weight-helper-text"
								labelWidth={0}
								autoFocus
								fullWidth={true}
							/>
						</div>
					</FormControl>
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button className={classes.rename_cancel_button} onClick={props.handleClickRenameUserClose} color="primary">{t('cancel')}</Button>
				<Button className={classes.rename_button} onClick={props.handleClickRenameUser} color="primary" variant="outlined">{t('modify')}</Button>
			</DialogActions>
		</Dialog>
	);
};

export default RenameUserDialog;