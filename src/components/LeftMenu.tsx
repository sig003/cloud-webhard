import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { GetFolderTypeFromPathname } from '../lib/Contents';
import { useTranslation } from 'react-i18next';

function LeftMenu(props:any) {
	const { t } = useTranslation();

	const leftMenu = [{menu: 'mydisk', menuName: t('rootFolderFile'), icon: <FolderOpenOutlinedIcon />}, 
					  {menu: 'share', menuName: t('rootFolderShare'), icon: <PeopleAltOutlinedIcon />}, 
					  {menu: 'favorite', menuName: t('rootFolderFavorite'), icon: <StarBorderOutlinedIcon />}, 
					  {menu: 'trash', menuName: t('rootFolderTrash'), icon: <DeleteOutlineOutlinedIcon />}];

	const selectedLeftMenu = GetFolderTypeFromPathname();

	return (
		leftMenu.map((list) => {
			return (
				<ListItem key={list.menu} button selected={selectedLeftMenu === list.menu} onClick={() => props.handleListItemClick(list.menu)}>
					<div className="disk_left_menu">
						{list.icon}
						<span className="blank"></span>{list.menuName}</div>
				</ListItem>
			);
		})
	);
}

export default LeftMenu;