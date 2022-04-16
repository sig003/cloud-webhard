import React, { useState, useEffect, useRef } from 'react';
import { getRootResourceKey } from '../api/Auth';
import '../css/disk.css';
import { unregister } from '../serviceWorker';
import DiskList from '../components/DiskList';
import UploadQuickButton from '../components/UploadQuickButton';
import Breadcrump from '../components/Breadcrumb';
import AvatarIcon from '../components/AvatarIcon';
import AvatarPopper from '../components/AvatarPopper';
import SearchBar from '../components/SearchBar';
import { RouteComponentProps } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { delClearTrash } from '../api/File';
import ClearTrashDialog from '../components/ClearTrashDialog';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import User from './User';
import Admin from './Admin';
import Typography from '@material-ui/core/Typography';
import LeftMenu from '../components/LeftMenu';
import { setListSort, getListSort } from '../lib/Contents';
import ListColumn from '../components/ListColumn';
import { useTranslation } from 'react-i18next';

function Disk(props:RouteComponentProps) {
	const [showAvatarPopper, setShowAvatarPopper] = useState(false);
	const [selectedLeftMenu, setSelectedLeftMenu] = useState('');
	const [chkClearTrash, setClearTrash] = useState(false);
	const [clearTrashOpen, setClearTrashOpen] = useState(false);
	const anchorRef = useRef<HTMLDivElement>(null);
	const [diskMenu, setDiskMenu] = useState('');
	const [sort, setSort] = useState({sortName: 'resourceName', sortDirection: 'asc'});
	const [chkMouseOver, setChkMouseOver] = useState({sortName: '', mouseOver: false});
	const { t } = useTranslation();

	const avatarHandlePopper = () => {
		setShowAvatarPopper((prev) => !prev);
	}

	const handleListItemClick = (menu:string) => {
		setSelectedLeftMenu(menu);

		let resourceKey : string = "";
		if (menu === "mydisk") resourceKey = '?resourceKey=' + getRootResourceKey('mydisk');
		else if (menu === "share") resourceKey = '?resourceKey=' + getRootResourceKey('share');
		else if (menu === "favorite") resourceKey = '?resourceKey=' + getRootResourceKey('favorite');
		else if (menu === "trash") resourceKey = '?resourceKey=' + getRootResourceKey('trash');

		if( menu === "favorite" || menu === "share") {
			alert('Comming Soon!!');
			return;
		} else {
			window.location.href = "/disk/" + menu + resourceKey;
		}
	};

	const handleClickClearTrashOpen = () => {
		setClearTrashOpen(true);
	};
	const handleClickClearTrashClose = () => {
		setClearTrashOpen(false);
	};
	const clearTrash = () => {
		const contentsClearTrash = delClearTrash();
		contentsClearTrash.then(function(res) {
			if (res.data.result === "F") {
				console.log('error : clearTrash');
				console.log(res);
			} else {
				console.log('success : clearTrash');
				window.location.reload(false);
			}
		});
	};

	const handleClickSorting = (sortName) => {
		const sortDirection = (sort.sortDirection === "asc") ? "desc":"asc";
		setSort({sortName: sortName, sortDirection: sortDirection});
		setListSort(sortName, sortDirection);
	}

	const handleMouseOver = (sortName) => {
		setChkMouseOver({sortName: sortName, mouseOver: true});
	}

	const handleMouseLeave = (sortName) => {
		setChkMouseOver({sortName: sortName, mouseOver: false});
	}

	useEffect(() => {
		const pathName = window.location.pathname;
		if (pathName === "/disk/trash") setClearTrash(true);
		else if (pathName === "/user") setDiskMenu('user');
		else if (pathName === "/admin") setDiskMenu('admin');
	});

	useEffect(() => {
		const listSortArray = getListSort().split('_');
		const sortName = listSortArray[0];
		const sortDirection = listSortArray[1];

		setSort({sortName: sortName, sortDirection: sortDirection});
		setListSort(sortName, sortDirection);
	},[]);


	return (
		<>
			<div className="container_disk">
				<div className="header">
					<div style={{cursor:'pointer'}} onClick={() => handleListItemClick('mydisk')}>NEW</div>
					<div>
						<SearchBar />
					</div>
					<div style={{cursor:'pointer', height:'45px'}} onClick={avatarHandlePopper} ref={anchorRef}><AvatarIcon /></div>
				</div>
				<div className="left">
					<div className="left_wrapper">
						<LeftMenu handleListItemClick={handleListItemClick} />
					</div>
				</div>
				{diskMenu === "user" || diskMenu === "admin" ?
				(<>
					<div className="nav">
						<div className="user_info_title">
							<Typography variant="h6" style={{fontWeight: 600}}>
								{diskMenu === "user" ? t('modifyUser'):t('modifyAdmin')}
							</Typography>
						</div>
					</div>
					<div className="disk">
						<div className="user_container">
							<div className="user_wrapper">
								{diskMenu === "user" ? <User/> : <Admin/>}
							</div>
						</div>
					</div>
				</>) :
				(<>
					<div className="nav">
						<div className="nav_wrapper">
							<div className="navigation">
								<Breadcrump />
								{chkClearTrash === true ? <Button onClick={handleClickClearTrashOpen}><DeleteForeverOutlinedIcon />{t('emptyTrash')}</Button>:<UploadQuickButton />}
							</div>
							<div className="content_align">
								<ListColumn 
									handleClickSorting={handleClickSorting} 
									handleMouseOver={handleMouseOver} 
									handleMouseLeave={handleMouseLeave}
									sort={sort}
									chkMouseOver={chkMouseOver}
								/>
							</div>
						</div>
					</div>
					<div className="disk" id="dragAndDropJone">
						<DiskList />
					</div>
				</>)
				}
			</div>
			{showAvatarPopper && <AvatarPopper component={props} setShowAvatarPopper={setShowAvatarPopper} showAvatarPopper={showAvatarPopper} anchorRef={anchorRef}/>}

			<ClearTrashDialog 
				clearTrashOpen={clearTrashOpen}
				handleClickClearTrashClose={handleClickClearTrashClose}
				clearTrash={clearTrash}
			/>
		</>
	);
};

export default Disk;
unregister();