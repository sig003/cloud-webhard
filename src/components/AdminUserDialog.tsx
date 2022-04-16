import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import { getAdminUserInfo, setAdminUserInfo } from '../api/Admin';
import InfoSnackBar from './InfoSnackBar';
import Typography from '@material-ui/core/Typography';
import { GetFormatBytes } from '../lib/Contents';
import { useTranslation } from 'react-i18next';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';

function AdminUserDialog(props:any) {
	const [infoSnackBar, setInfoSnackBar] = useState({mode: '', type: '', code: ''});
	const [userInfo, setUserInfo] = useState([]);
	const { t } = useTranslation();
	const [userType, setUserType] = useState('');
	const [userRegDate, setUserRegDate] = useState('');
	const [userName, setUserName] = useState('');	
	
	const useStyles = makeStyles((theme: Theme) =>
		createStyles({
			root: {
				display: 'flex',
				'& > *': {
					margin: theme.spacing(1),
				},
			},
			small: {
				width: theme.spacing(3),
				height: theme.spacing(3),
			},
			large: {
				width: theme.spacing(7),
				height: theme.spacing(7),
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
			save_button: {
				background: '#1182DF',
				border: 'none',
				color: '#FFFFFF',
				'&:hover': {
					backgroundColor: '#088FFF',
					border: 'none',
					boxShadow: 'none',
				},
			},
			cancel_button: {
				color:'#190707',
			},
			bold: {
				fontWeight: 600
			},
			formControl: {
				margin: theme.spacing(0),
				minWidth: 120,
			},
			name: {
				marginBottom: theme.spacing(1),
				width: '17ch',
			}
		}),
	);
	const classes = useStyles();

	const handleChangeUserType = () => {
		const changeUserType = (userType === "A") ? "U":"A";
		setUserType(changeUserType);
	}
	const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserName(e.target.value);
	}
	
	const handleUpdateUserInfo = () => {
		const contentsAdminUserInfo = setAdminUserInfo(userInfo.memberKey, userName, userType);
		contentsAdminUserInfo.then(function(res) {
			if (res.data.result === "F") {
				setInfoSnackBar({mode: 'admin', type: 'error', code: 'ADMIN002'});
			} else {
				setInfoSnackBar({mode: 'admin', type: 'success', code: 'ADMIN003'});
				props.loadUserList();
			}
		});
	} 

	useEffect(() => {
		const contentsAdminUserInfo = getAdminUserInfo(props.selectedMemberKey);
		contentsAdminUserInfo.then(function(res) {
		if (res.data.result === "F") {
			setInfoSnackBar({mode: 'admin', type: 'error', code: 'ADMIN001'});
		} else {
			setUserInfo(res.data.info[0]);
			const returnUserType = (res.data.info[0].memberType === "A") ? "A":"U";
			const returnCreateDate = res.data.info[0].createDate.split(' ');
			const returnUserName = res.data.info[0].name;
			if (returnUserType !== "") {
				setUserType(returnUserType);
			}
			if (returnCreateDate[0] !== "") {
				setUserRegDate(returnCreateDate[0]);
			}
			if (returnUserName !== "") {
				setUserName(returnUserName);
			}
		}
	});
	},[props.selectedMemberKey]);

	return (
		<>
			<Dialog
				open={props.adminUserOpen}
				onClose={props.handleClickUserClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{t('modify')}
					<IconButton aria-label="close" className={classes.closeButton} onClick={props.handleClickAdminUserClose}>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<Divider />
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						<div className="user_info">
							<div>
								<Avatar className={classes.large} src="http://10.52.5.200/test/images/RG.jpg"/> 
							</div>
							<div className="user_value">
								<div>
									<Input
										className={classes.name}
										id="standard-adornment-weight"
										value={userName}
										onChange={handleChangeUserName}
										aria-describedby="standard-weight-helper-text"
          							/>
								</div>
								<div><Typography className={classes.bold}>{userInfo.email}</Typography></div>
							</div>
						</div>
						<Divider />
						<div className="user_info">
							<div>
								{t('userStatus')}
							</div>
							<div className="user_value">
								<div><Typography className={classes.bold}>{userInfo.enable === true ? t('userStatusActive'):t('userStatusInactive')}</Typography></div>
							</div>
						</div>
						<Divider />
						<div className="user_info">
							<div>
								{t('userQuota')}
							</div>
							<div className="user_value">
								<div><Typography className={classes.bold}>{GetFormatBytes(userInfo.quota)}</Typography></div>
							</div>
						</div>
						<Divider />
						<div className="user_info">
							<div>
								{t('userType')}
							</div>
							<div className="user_value">
								<FormControl className={classes.formControl}>
									<Select
										value={userType}
										onChange={handleChangeUserType}
										inputProps={{
											name: 'userType',
											id: 'userType',
										}}
									>
										<MenuItem value="A">{t('adminUser')}</MenuItem>
										<MenuItem value="U">{t('nomalUser')}</MenuItem>
        							</Select>
								</FormControl>
							</div>
						</div>
						<Divider />
						<div className="user_info">
							<div>
								{t('userJoinDate')}
							</div>
							<div className="user_value">
								<div><Typography className={classes.bold}>{userRegDate}</Typography></div>
							</div>
						</div>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button className={classes.cancel_button} onClick={props.handleClickAdminUserClose} color="primary">{t('cancel')}</Button>
					<Button className={classes.save_button} color="primary" variant="outlined" onClick={handleUpdateUserInfo}>{t('modify')}</Button>
				</DialogActions>
			</Dialog>

			<InfoSnackBar
				infoSnackBar={infoSnackBar}
				setInfoSnackBar={setInfoSnackBar}
			/>
		</>
	);
};

export default AdminUserDialog;