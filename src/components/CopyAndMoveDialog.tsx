import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined';
import { yellow } from '@material-ui/core/colors';
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';
import { getFolderList } from '../api/DiskList';
import { getRootResourceKey } from '../api/Auth';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import Typography from '@material-ui/core/Typography';
import { GetFolderTypeFromPathname } from '../lib/Contents';
import { useTranslation } from 'react-i18next';

function CopyAndMoveDialog(props:any) {
	const [folderList ,setFolderList] = useState([{resourceKey: '', resourceName: '', parentResourceKey: '', childFolderCount: 0}]);
	const [selectedResourceKey, setSelectedResourceKey] = useState('');
	const [beforeSelectedResourceKey, setBeforeSelectedResourceKey] = useState<any>(['']);
	const [showBeforeButton, setShowBeforeButton] = useState(false);
	const [folderType, setFolderType] = useState('');
	const [stopMoveChildFolder, setStopMoveChildFolder] = useState(false);
	const [folderDepth, setFolderDepth] = useState(0);
	const { t } = useTranslation();

	const useStyles = makeStyles((theme: Theme) => createStyles({
		setButton: {
			background: '#1182DF',
			border: 'none',
			color: '#FFFFFF',
			'&:hover': {
				backgroundColor: '#088FFF',
				border: 'none',
				boxShadow: 'none',
			},
		},
		cancelButton: {
			color:'#190707',
		},
		closeButton: {
			position: 'absolute',
			right: theme.spacing(1),
			top: theme.spacing(1),
			color: theme.palette.grey[500],
		},
		dialogContentBox: {
			width: '50ch',
			height: '50ch',
			border: '1px solid #303AA6',
			overflowY: 'auto',
		},
		list: {
			padding: '0px 0px 0px 0px',
		},
		listFolder : {
			display:'flex',
			justifyContent:'center',
		},
		listArrow: {
			display:'flex',
			justifyContent:'flex-end',
		},
		listText: {
			overflow: 'hidden',
			whiteSpace: 'nowrap',
			textOverflow: 'ellipsis',
		},
	}));
	const classes = useStyles();

	const loadDirList = () => {
		const resourceKey = (selectedResourceKey !== '') ? selectedResourceKey : getRootResourceKey(folderType);

		const dirListData = getFolderList(resourceKey, folderType);
		dirListData.then(function(res) {
			if (res.data.result === "S") {
				res.data.list.map((list:any) => {
					setFolderList(prev=>[...prev, {resourceKey:list.resourceKey, resourceName:list.resourceName, parentResourceKey:list.parentKey, childFolderCount:list.childFolderCount}]);
				})
			} else {
				console.log('error');
			}
		});
	};

	const handleClickResourceKey = (resourceKey:string, parentResourceKey:string, childFolderCount:number) => {
		if (childFolderCount === 0) {
			setStopMoveChildFolder(true);
		} else {
			setFolderDepth(prev => prev + 1);
			setStopMoveChildFolder(false);
		}
		props.setChkPasteDir(false);
		setSelectedResourceKey(resourceKey);

		let lastResourceKey = beforeSelectedResourceKey[beforeSelectedResourceKey.length-1];
		if (lastResourceKey !== parentResourceKey && childFolderCount > 0) setBeforeSelectedResourceKey((prev:any) => [...prev, parentResourceKey]);

		props.setPasteDir(resourceKey);
	};

	const handleBeforeFolder = () => {
		props.setChkPasteDir(false);

		if (folderDepth > 0) {
			setFolderDepth(prev => prev - 1);
			setStopMoveChildFolder(false);
			setSelectedResourceKey(beforeSelectedResourceKey[folderDepth]);
			if (beforeSelectedResourceKey.length > 2) beforeSelectedResourceKey.pop();
		} else {
			setSelectedResourceKey('');
			const rootResourceKey = getRootResourceKey(folderType);
			let lastResourceKey = beforeSelectedResourceKey[beforeSelectedResourceKey.length-1];
			if (rootResourceKey !== lastResourceKey) setBeforeSelectedResourceKey((prev:any) => [...prev, rootResourceKey]);
			loadDirList();
		}
	};

	useEffect(() => {
		if (props.copyAndMoveOpen === false) {
			setFolderList([{resourceKey: '', resourceName: '', parentResourceKey: '',childFolderCount: 0}]);
			setSelectedResourceKey('');
		} else {
			loadDirList();
		}
	},[props.copyAndMoveOpen]);

	useEffect(() => {
		if (selectedResourceKey !== '' && stopMoveChildFolder === false) {
			setFolderList([{resourceKey: '', resourceName: '', parentResourceKey: '', childFolderCount: 0}]);
			loadDirList();
		}
	},[selectedResourceKey])

	useEffect(() => {
		if (folderDepth > 0) setShowBeforeButton(true);
		else setShowBeforeButton(false);
	},[folderList])

	useEffect(() => {
		const folderType = GetFolderTypeFromPathname();
		setFolderType(folderType);
	},[]);

	return(
		<Dialog
			open={props.copyAndMoveOpen}
			onClose={props.handleCopyAndMoveClose}
	 		aria-labelledby="alert-dialog-title"
	 		aria-describedby="alert-dialog-description"
 		>
			<DialogTitle id="alert-dialog-title">{t('contentsCopy')} / {t('contentsMove')}
				<IconButton aria-label="close" className={classes.closeButton} onClick={props.handleCopyAndMoveClose}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				{showBeforeButton === true ? 
					<Button className={classes.cancelButton} onClick={handleBeforeFolder}><KeyboardArrowLeftIcon />{t('moveBeforeFolder')}</Button>
				   :<Button className={classes.cancelButton} disabled><KeyboardArrowLeftIcon />{t('moveBeforeFolder')}</Button>}
				<DialogContentText id="alert-dialog-description" className={classes.dialogContentBox}>
					<List className={classes.list}>
						{folderList.filter((element:any) => element.resourceKey !== "" && element.resourceName !== "").map((list, index) => {
							return (
								<ListItem key={index} button style={{paddingLeft:'0px'}} onClick={()=>handleClickResourceKey(list.resourceKey, list.parentResourceKey, list.childFolderCount)}>
									<ListItemIcon className={classes.listFolder}>
										<FolderOutlinedIcon style={{color:yellow[600], fontSize:20}} />
									</ListItemIcon>
									<ListItemText secondary={list.resourceName} title={list.resourceName} className={classes.listText}/>
									<ListItemIcon className={classes.listArrow}>
										{list.childFolderCount > 0 ? <ChevronRightOutlinedIcon style={{fontSize:20}}/>:''}
									</ListItemIcon>
								</ListItem>
							)
						})}
					</List>
				</DialogContentText>
				{props.chkPasteDir === true ? <Typography color="error">{t('sameFolderErrorMessage')}</Typography>:""}
			</DialogContent>
			
			<DialogActions>
				<Button className={classes.cancelButton} onClick={props.handleCopyAndMoveClose} color="primary">{t('cancel')}</Button>
				{props.chkPasteDir === true ? 
					<>
					<Button variant="outlined" disabled>{t('contentsCopy')}</Button>
					<Button variant="outlined" disabled>{t('contentsMove')}</Button>
					</>
					:
					<>
					<Button className={classes.setButton} onClick={()=>props.handlePaste('copy')} color="primary" variant="outlined">{t('contentsCopy')}</Button>
					<Button className={classes.setButton} onClick={()=>props.handlePaste('move')} color="primary" variant="outlined">{t('contentsMove')}</Button>
					</>
					}

			</DialogActions>
		</Dialog>
	);
};

export default CopyAndMoveDialog;