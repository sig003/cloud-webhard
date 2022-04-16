import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { getAdminUserList, setAdminUserEnable } from '../api/Admin';
import InfoSnackBar from './InfoSnackBar';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { GetFormatBytes } from '../lib/Contents';
import AdminUserDialog from './AdminUserDialog';
import { useTranslation } from 'react-i18next';

//해당 부분은 임시로 하트코딩한 내용임, 추후 제거 
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //최대값은 제외, 최소값은 포함
  }

function AdminUserList() {
	const [infoSnackBar, setInfoSnackBar] = useState({mode: '', type: '', code: ''});
	const [userList, setUserList] = useState([]);
	const [adminUserOpen, setAdminUserOpen] = useState(false);
	const [selectedMemberKey, setSelectedMemberKey] = useState('');
	const { t } = useTranslation();

	const loadUserList = () => {
		const contentsAdminUserList = getAdminUserList();
			contentsAdminUserList.then(function(res) {
			if (res.data.result === "F") {
				setInfoSnackBar({mode: 'admin', type: 'error', code: 'ADMIN001'});
			} else {
				setUserList(res.data.list);
			}
		});
	}

	const handleClickAdminUserOpen = (memberKey:string) => {
		setSelectedMemberKey(memberKey);
		setAdminUserOpen(true);
	};
	const handleClickAdminUserClose = () => {
		setAdminUserOpen(false);
	};

	const handleClickUserEnable = (memberKey:string, enable:boolean) => {
		//enable = !enable;
		const contentsUserEnable = setAdminUserEnable(memberKey, !enable);
		contentsUserEnable.then(function(res) {
		if (res.data.result === "F") {
			setInfoSnackBar({mode: 'adminUserEnable', type: 'error', code: 'USERENABLE001'});
		} else {
			setInfoSnackBar({mode: 'adminUserEnable', type: 'success', code: 'USERENABLE002'});
			loadUserList();
		}
	});
	}

	//해당 부분은 임시로 하트코딩한 내용임, 추후 제거 
	const image = {
		1 : "http://10.52.5.200/test/images/LD.jpg",
		2 : "http://10.52.5.200/test/images/BP.jpg",
		3 : "http://10.52.5.200/test/images/LB.png",
		4 : "http://10.52.5.200/test/images/RG.jpg",
		5 : "http://10.52.5.200/test/images/TC.jpg",
	}

	useEffect(() => {
		loadUserList();
	},[]);

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
		}),
	);
	const classes = useStyles();
	
//리스트 페이징
//수정, 조회 시 info
//사진 표시
//반응형웹
	return (
		<div>
			<div className="admin_list_column">
				<div className="admin_list_column_name">{t('userName')}</div>
				<div className="admin_list_column_etc">{t('account')}</div>
				<div className="admin_list_column_etc">{t('userStatus')}</div>
				<div className="admin_list_column_etc">{t('userQuota')}</div>
				<div className="admin_list_column_etc"></div>
			</div>
			<Divider />
		{userList.map((list) => {
			//해당 부분은 임시로 하트코딩한 내용임, 추후 제거 
			let randomVal = getRandomInt(1, 6);
			let size = GetFormatBytes(list.quota);
			return (
				<div key={list.email}>
					<div className="admin_list">
						<div className="admin_list_icon"><Avatar src={image[randomVal]} className={classes.large} alt={list.name}/></div>
						<div className="admin_list_name">{list.name}</div>
						<div className="admin_list_email">{list.email}</div>
						<div className="admin_list_status">
							<Button href="#text-buttons" onClick={() => handleClickUserEnable(list.memberKey, list.enable)} color="primary">
								{list.enable === true ? t('userStatusActive'):t('userStatusInactive')}
							</Button>
						</div>
						<div className="admin_list_quota">{size}</div>
						<div className="admin_list_button"><Button variant="outlined" disableRipple onClick={() => handleClickAdminUserOpen(list.memberKey)}>{t('modify')}</Button></div>
					</div>
					<Divider />
				</div>
			)
		})}

		<AdminUserDialog 
			adminUserOpen={adminUserOpen} 
			handleClickAdminUserClose={handleClickAdminUserClose}
			selectedMemberKey={selectedMemberKey}
			loadUserList={loadUserList}
		/>			
		<InfoSnackBar
			infoSnackBar={infoSnackBar}
			setInfoSnackBar={setInfoSnackBar}
		/>
		</div>
	)
}

export default AdminUserList;