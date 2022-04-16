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

function ModifyUserPasswordDialog(props:any) {
	const useStyles = makeStyles((theme: Theme) => createStyles({
		modify_button: {
			background: '#1182DF',
			border: 'none',
			color: '#FFFFFF',
			'&:hover': {
				backgroundColor: '#088FFF',
				border: 'none',
				boxShadow: 'none',
			},
		},
		modify_cancel_button: {
			color:'#190707',
		},
		margin: {
			margin: theme.spacing(1),
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
		},
		dialogContentsText: {
			color: '#000000'
		}
	}));
	const classes = useStyles();
	const { t } = useTranslation();

	return (
		<Dialog
			open={props.modifyUserPasswordOpen}
			onClose={props.handleClickUserPasswordClose}
	 		aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			maxWidth="xs"
 		>
			<DialogTitle id="alert-dialog-title">{t('changePassword')}
				<IconButton aria-label="close" className={classes.closeButton} onClick={props.handleClickUserPasswordClose}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					<FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
						<div className={classes.dialogContentsText}>{t('currentPassword')}</div>
						<div className={classes.dialogText}>
							<OutlinedInput 
								id="outlined-adornment-weight"
								onChange={props.handleModifyUserPasswordCurrent}
								type="password"
								aria-describedby="outlined-weight-helper-text"
								labelWidth={0}
								autoFocus
								fullWidth={true}
								margin="dense"
								placeholder="Current Password"
							/>
						</div>
					</FormControl>
					<FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
						<div className={classes.dialogContentsText}>{t('newPassword')}</div>
						<div className={classes.dialogText}>
							<OutlinedInput
								id="outlined-adornment-weight"
								onChange={props.handleModifyUserPasswordNew}
								type="password"
								aria-describedby="outlined-weight-helper-text"
								labelWidth={0}
								fullWidth={true}
								margin="dense"
								placeholder="New Password"
							/>
						</div>
					</FormControl>	
					<FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
						<div className={classes.dialogContentsText}>{t('confirmNewPassword')}</div>
						<div className={classes.dialogText}>
							<OutlinedInput
								id="outlined-adornment-weight"
								onChange={props.handleModifyUserPasswordConfirm}
								type="password"
								aria-describedby="outlined-weight-helper-text"
								labelWidth={0}
								fullWidth={true}
								margin="dense"
								placeholder="Confirm New Password"
							/>
						</div>
					</FormControl>
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button className={classes.modify_cancel_button} onClick={props.handleClickUserPasswordClose} color="primary">{t('cancel')}</Button>
				<Button className={classes.modify_button} onClick={props.handleClickModifyUserPassword} color="primary" variant="outlined">{t('modify')}</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ModifyUserPasswordDialog;