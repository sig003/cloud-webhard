import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import { getUserInfo, setRenameUser, setModifyUserPassword } from '../api/User';
import RenameUserDialog from './RenameUserDialog';
import QuotaAndUsageBox from '../components/QuotaAndUsageBox';
import InfoSnackBar from './InfoSnackBar';
import LanguageIcon from '@material-ui/icons/Language';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LanguageDialog from '../components/LanguageDialog';
import { useTranslation } from 'react-i18next';
import LockIcon from '@material-ui/icons/Lock';
import ModifyUserPasswordDialog from '../components/ModifyUserPasswordDialog';

function UserInfo() {
	const [userId, setUserId] = useState('');
	const [userName, setUserName] = useState('');
	const [renameUserOpen, setRenameUserOpen] = useState(false);
	const [renameUser, setDialogRenameUser] = useState<string>('');
	const [infoSnackBar, setInfoSnackBar] = useState({mode: '', type: '', code: ''});
	const [languageOpen, setLanguageOpen] = useState(false);
	const { t } = useTranslation();
	const [modifyUserPasswordOpen, setModifyUserPasswordOpen] = useState(false);

	const [modifyUserPasswordCurrent, setModifyUserPasswordCurrent] = useState('');
	const [modifyUserPasswordNew, setModifyUserPasswordNew] = useState('');
	const [modifyUserPasswordConfirm, setModifyUserPasswordConfirm] = useState('');

	const loadUserInfo = () => {
		const contentsUserInfo = getUserInfo();
		contentsUserInfo.then(function(res) {
			if (res.data.result === "F") {
				setInfoSnackBar({mode: 'username', type: 'error', code: 'USERNAME003'});
			} else {
				setUserId(res.data.info.uid)
				setUserName(res.data.info.name)
			}
		});
	}

	const handleClickRenameUser = () => {
		setRenameUserOpen(false);
		const contentsRename = setRenameUser(renameUser);
		contentsRename.then(function(res) {
			if (res.data.result === "F") {
				setInfoSnackBar({mode: 'username', type: 'error', code: 'USERNAME002'});
			} else {
				loadUserInfo();
				setInfoSnackBar({mode: 'username', type: 'success', code: 'USERNAME001'});
			}
		});
	}
	const handleClickRenameUserOpen = () => {
		setDialogRenameUser(userName);
		setRenameUserOpen(true);
	};
	const handleRenameUserChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		setDialogRenameUser(e.target.value);
	}
	const handleClickRenameUserClose = () => {
		setRenameUserOpen(false);
	};
	const handleClickLanguageOpen = () => {
		setLanguageOpen(true);
	};
	const handleClickLanguageClose = () => {
		setLanguageOpen(false);
	};


	const handleClickUserPasswordOpen = () => {
		setModifyUserPasswordOpen(true);
	}
	const handleClickUserPasswordClose = () => {
		setModifyUserPasswordOpen(false);
	}
	const handleModifyUserPasswordCurrent = (e:React.ChangeEvent<HTMLInputElement>) => {
		setModifyUserPasswordCurrent(e.target.value);
	}
	const handleModifyUserPasswordNew = (e:React.ChangeEvent<HTMLInputElement>) => {
		setModifyUserPasswordNew(e.target.value);
	}
	const handleModifyUserPasswordConfirm = (e:React.ChangeEvent<HTMLInputElement>) => {
		setModifyUserPasswordConfirm(e.target.value);
	}
	const handleClickModifyUserPassword = () => {
		if (modifyUserPasswordNew != modifyUserPasswordConfirm) {
			setInfoSnackBar({mode: 'userPassword', type: 'error', code: 'USERPASSWORD004'});
			return;
		}
		const contentsModifyUserPassword = setModifyUserPassword(modifyUserPasswordCurrent, modifyUserPasswordNew, modifyUserPasswordConfirm);
		console.log(contentsModifyUserPassword)
		contentsModifyUserPassword.then(function(res) {
			if (res.data.result === "F") {
				if (res.data.code === 102) {
					setInfoSnackBar({mode: 'userPassword', type: 'error', code: 'USERPASSWORD002'});
				} else {
					setInfoSnackBar({mode: 'userPassword', type: 'error', code: 'USERPASSWORD003'});
				}
			} else {
				setModifyUserPasswordOpen(false);
				setInfoSnackBar({mode: 'userPassword', type: 'success', code: 'USERPASSWORD001'});
			}
		});
	}

	useEffect(() => {
		loadUserInfo();
	},[]);

	return (
		<div>
			<div className="user_info">
				<div className="user_info">
					<div>{t('account')}</div>
					<Box p={5}></Box>
					<div>{userId}</div>
				</div>
			</div>
			<Divider />
			<Box p={2}></Box>
			<div className="user_info">
				<div className="user_info">
					<div>{t('userName')}</div>
					<Box p={5}></Box>
					<div>{userName}</div>
				</div>
				<div>
					<Button variant="outlined" disableRipple onClick={handleClickRenameUserOpen}>{t('modify')}</Button>
				</div>
			</div>
			<Divider />
			<Box p={2}></Box>
			<div className="user_info">
				<div className="user_info">
					<div>{t('password')}</div>
					<Box p={3}></Box>
					<div><LockIcon fontSize="large"/></div>
				</div>
				<div>
					<Button variant="outlined" disableRipple onClick={handleClickUserPasswordOpen}>{t('modify')}</Button>
				</div>
			</div>
			<Divider />
			<Box p={2}></Box>
			<div className="user_info">
				<div className="user_info">
					<div>{t('diskUsage')}</div>
					<Box p={4}></Box>
					<div><QuotaAndUsageBox /></div>
				</div>
			</div>
			<Divider />
			<Box p={2}></Box>
			<div className="user_info">
				<div className="user_info">
					<div>{t('changeLanguage')}</div>
					<Box p={3}></Box>
					<div className="language_box" onClick={handleClickLanguageOpen}>
						<LanguageIcon fontSize="small"/>
						<Box mr={1} />
						{t('language')}
						<ExpandMoreIcon fontSize="small"/>
					</div>
				</div>
			</div>

			<RenameUserDialog 
				renameUserOpen={renameUserOpen} 
				handleClickRenameUserClose={handleClickRenameUserClose} 
				rename={renameUser} 
				handleRenameUserChange={handleRenameUserChange} 
				handleClickRenameUser={handleClickRenameUser}
			/>
			<InfoSnackBar
				infoSnackBar={infoSnackBar}
				setInfoSnackBar={setInfoSnackBar}
			/>
			<LanguageDialog
				languageOpen={languageOpen}
				handleClickLanguageClose={handleClickLanguageClose}
			/>
			<ModifyUserPasswordDialog
				modifyUserPasswordOpen={modifyUserPasswordOpen}
				handleClickUserPasswordClose={handleClickUserPasswordClose}
				handleClickModifyUserPassword={handleClickModifyUserPassword}
				handleModifyUserPasswordCurrent={handleModifyUserPasswordCurrent}
				handleModifyUserPasswordNew={handleModifyUserPasswordNew}
				handleModifyUserPasswordConfirm={handleModifyUserPasswordConfirm}
			/>
		</div>
	)
}

export default UserInfo;