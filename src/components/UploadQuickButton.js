import React, { useState, useEffect, useRef } from 'react';
import Flow from '../lib/uploader';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import UploadRightRegion from './UploadRightRegion';
import { ServerInfo, Upload } from '../conf/ServerInfo';
import { ChkUploadFile, GetQuotaAndUsage } from '../api/File';
import { GetUrlResourceKey, GetFolderTypeFromPathname } from '../lib/Contents';
import InfoSnackBar from './InfoSnackBar';

function UploadQuickButton() {
	const addFile = useRef(null);
	const addFolder = useRef(null);
	const [showRightRegion, setShowRightRegion] = useState(false);
	const [flowObj, setFlowObj] = useState([]);
	const [flowProgress, setProgress] = useState([{name: '', progress: 0}]);
	const [arrFlowProgress, setArrFlowProgress] = useState([{name: '', progress: 0}]);
	const [folderType, setFolderType] = useState('');
	const [quotaAndUsage, setQuotaAndUsage] = useState([{quota: 0, usage: 0}]);
	const [infoSnackBar, setInfoSnackBar] = useState({mode: '', type: '', code: ''});

	const oTokenHead = {
		"Authorization": "Bearer " + sessionStorage.getItem( "access_token" )
	}

	const resourceKey = GetUrlResourceKey();

	const chkUploadFile = (file) => {
		const contentsChkUploadFile = ChkUploadFile(resourceKey, folderType, file.name);
		contentsChkUploadFile.then(function(res) {
			if (res.data.result === "F") {
				console.log('error : chkUploadFile');
				console.log(res);
				if (res.data.code === 103) console.log('duplicate file name');
				file.cancel();
				return 'F';
			} else {
				console.log('success : chkUploadFile');
				return 'S';
			}
		}, function(error) {
			console.log(error.response);
			if (error.response.status === 400) {
				console.log('Invalid Parameter');
				return 'F';
			}
		});
	}

	const getQuotaAndUsage = () => {
		const contentsQuotaAndUsage = GetQuotaAndUsage(resourceKey, folderType);
		contentsQuotaAndUsage.then(function(res) {
			if (res.data.result === "F") {
				console.log('error : chkQuotaAndUsage');
				return 'F';
			} else {
				//console.log('success : chkQuotaAndUsage');
				const quota = res.data.info.quota;
				const usage = res.data.info.usage;
				setQuotaAndUsage({quota, usage});
				return 'S';
			}
		}, function(error) {
			console.log(error.response);
			if (error.response.status === 400) {
				console.log('Invalid Parameter');
				return 'F';
			}
		});
	};

	const flow = new Flow({
		target:ServerInfo + Upload,
		forceChunkSize : true,
		query:{},
		headers : oTokenHead,
		testChunks: false,
		//chunkSize: 1 * 1024 * 1024,
		initFileFn : null,
		resourceKey : resourceKey,
		folderType: GetFolderTypeFromPathname(),
		generateUniqueIdentifier: function() {
			return Math.random().toString(36).substring(3,9) +"_"+ new Date().getTime();
		}
	});

	useEffect(() => {
		flow.assignBrowse(addFile.current);
		flow.assignBrowse(addFolder.current, true);
	});
	useEffect(() => {
		const pathName = window.location.pathname;
		if( pathName === "/disk/mydisk") flow.assignDrop(document.getElementById('dragAndDropJone'));
	},[]);
	useEffect(() => {
		const folderType = GetFolderTypeFromPathname();
		setFolderType(folderType);
	},[]);
	useEffect(() => {
		if (folderType) getQuotaAndUsage();
	},[folderType]);

	flow.on('filesSubmitted', function(file, event) {
		const quota = quotaAndUsage.quota;
		const usage = quotaAndUsage.usage;
		let uploadingSize = 0;
		file.map((list:any) => {
			uploadingSize += list.size;
		});
		if (quota < uploadingSize + usage) {
			flow.cancel();
			setInfoSnackBar({mode: 'upload', type: 'error', code: 'UPLOAD002'});
			//window.location.reload();
		} else {
			flow.upload();
		}
	});

	flow.on('fileAdded', function(file, event) {
		//setTimeout(function(){
			chkUploadFile(file);
			setFlowObj(prev => [...prev, file]);
			setShowRightRegion(true);
		//	flow.upload();
		//}, 500);
	});
	flow.on('uploadStart', function(file,message) {
		console.log('uploadStart');
	});
	flow.on('fileSuccess', function(file,message) {
		//????????? ?????? ?????? ???????????? ???
		//window.location.reload(false);
		console.log('success');
		//message return value : {"result":"S"}
		console.log(message);
	});
	flow.on('fileError', function(file, message) {
		console.log('error');
		console.log(file);
		console.log(message);
	});
	flow.on('fileProgress', function(file, chunk) {
		setProgress([{name:file.name, progress:Math.floor(file.progress() * 100 )}]);			
	});
	flow.on('fileRemoved', function(file) {
		console.log( "?????? ??????", file ); 
	});
	//????????? ??????

	//progress ?????? ?????? ??????
	//flow.js ??? fileProgress ????????? ?????????????????? flowProgress ????????? ????????? ?????? ???????????? ???
	//flowProgress ??? ????????? ???????????? arrFlowProgress ??? ?????? ????????? ????????? ??????
	//????????? ????????? name ?????? flowProgress??? name?????? ????????? update ??????, ?????? ?????? ?????? ????????? progress ?????? ?????? (progress ?????? ????????? ??????)
	//????????? ????????? insert ??????
	useEffect(()=>{
		const arrLength = arrFlowProgress.length;
		if (arrFlowProgress[arrLength-1].name == flowProgress[0].name)  {
			let arr = arrFlowProgress.slice(0, arrLength-1);
			setArrFlowProgress([...arr, {name:flowProgress[0].name, progress:flowProgress[0].progress}]);
		} else {
			setArrFlowProgress(prev => [...prev, {name:flowProgress[0].name, progress:flowProgress[0].progress}]);
		}
	},[flowProgress]);

	//????????? ?????? ???????????? ?????? uploader.js ?????? this.files ??? ????????????
	/*useEffect(() => {
		if( showRightRegion === true ) {
			flow.upload();
		}
	}, [showRightRegion]);*/

	//????????? ??????
	const useStyles = makeStyles((theme) => ({
		root: {
		  display: 'flex',
		},
		paper: {
		  marginRight: theme.spacing(2),
		},
	}));

	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const anchorRef = useRef(null);

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};
	
	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}

		setOpen(false);
		setShowRightRegion(false);
	};
	
	function handleListKeyDown(event) {
		if (event.key === 'Tab') {
			event.preventDefault();
			setOpen(false);
		}
	}
	
	// return focus to the button when we transitioned from !open -> open
	const prevOpen = useRef(open);

	useEffect(() => {
		if (prevOpen.current === true && open === false) {
			anchorRef.current.focus();
		}

		prevOpen.current = open;
	}, [open]);

	return (
		<div>
			<Button variant="outlined" ref={anchorRef} aria-controls={open ? 'menu-list-grow' : undefined} aria-haspopup="true" onClick={handleToggle}>?????????</Button>
			<Popper style={{zIndex:10}} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
				{({ TransitionProps, placement }) => (
					<Grow
					{...TransitionProps}
					style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
					>
					<Paper>
						<ClickAwayListener onClickAway={handleClose}>
						<MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
							<MenuItem ref={addFile}>??????</MenuItem>
							<MenuItem ref={addFolder}>??????</MenuItem>
						</MenuList>
						</ClickAwayListener>
					</Paper>
					</Grow>
				)}
			</Popper>
			
			{showRightRegion && <UploadRightRegion file={flowObj} progress={arrFlowProgress} flow={flow}/>}

			<InfoSnackBar
				infoSnackBar={infoSnackBar}
				setInfoSnackBar={setInfoSnackBar}
			/>
		</div>
	);
};

export default UploadQuickButton;