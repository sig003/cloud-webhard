import React, { useState, useEffect, useRef } from 'react';
import { getListCount, getList } from '../api/DiskList';
import moment from 'moment';
import ListItem from '@material-ui/core/ListItem';
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import { yellow, grey, blue } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
import BatteryCharging20Icon from '@material-ui/icons/BatteryCharging20';
import { CountContentsLength, GetUrlResourceKey, GetFolderTypeFromPathname, GetFormatBytes, getListSort } from '../lib/Contents';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { delDelete, setPaste, setRename, setNewFolder, setRestore } from '../api/File';
import RenameDialog from './RenameDialog';
import NewFolderDialog from './NewFolderDialog';
import DownloadSnackBar from './DownloadSnackBar';
import CopyAndMoveDialog from './CopyAndMoveDialog';
import { getRootResourceKey } from '../api/Auth';
import InfoSnackBar from './InfoSnackBar';
import PermanentDeleteDialog from './PermanentDeleteDialog';
import { getToken } from '../api/Auth';
import { ServerInfo, Download, MultiDownload } from '../conf/ServerInfo';
import { useTranslation } from "react-i18next";
import '../css/selecto.css';
import Selecto from "react-selecto";

function DiskList() {
	const { t } = useTranslation();
	const [infoSnackBar, setInfoSnackBar] = useState({mode: '', type: '', code: ''});
	const target = useRef<HTMLDivElement>(null);
	const [limit, setLimit] = useState(100);
	const [page, setPage] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	const [listCount, setListCount] = useState(0);
	const [sortName, setSortName] = useState('');
	const [sortDirection, setSortDirection] = useState('');
	const [list, setList] = useState([{'resourceType':'','resourceKey':'','resourceName':'','maker':'','makerKey':'','parentKey':'','childFolderCount':0,'fileExt':'','fileSize':'','folderType':'','folderUsage':0,'hidden':'N','createDate':'','updateDate':'','lastModifyDate':'','deleteDate':'', 'selected':false}]);
	const [selectedResource, setSelectedResource] = useState({'resourceType':'', 'resourceKey':'', 'resourceName':''});
	const [emptyFolder, setEmptyFolder] = useState(false);
	const [loading, setLoading] = useState(false);
	const [folderType, setFolderType] = useState('');
	const listSort = getListSort();
	const [contextMenuClick, setContextMenuClick] = useState(false);
	
	const loadListCount = () => {
		const ListCount = getListCount(selectedResource, folderType);
		ListCount.then(function(res) {
			if (res.data.result === "S") {
				setListCount(res.data.count);
			} else {
				console.log('error : get list count');
			}
		});
	};

	const loadList = () => {
		const List = getList(selectedResource, folderType, currentPage, sortName, sortDirection, limit);
		List.then(function(res) {
			if (res.data.result === "S") {
				let arr:any = [];
				res.data.list.map((list:any)=>{
					arr.push(list);
				});
				if (arr.filter((list:any) => list.resourceKey !== "").length < 1 && page <= 0) setEmptyFolder(true);
				setList(prev=>prev.concat(arr));
			} else {
				console.log('error : get list');
			}
		});
	};

	useEffect(()=> { 
		const options = { 
			root: null, 
			threshold: 0, 
		};

		const handleIntersection = (entries:any, observer:any) => {
			entries.forEach((entry:any) => {
				if (!entry.isIntersecting) { 
					return;
				} else {
					setCurrentPage(currentPage => currentPage+1);
				}
			});
		};

		const io = new IntersectionObserver(handleIntersection, options);
		if (target.current) { 
			io.observe(target.current); 
		}
		return () => io && io.disconnect();
	},[target,page]);

	useEffect(() => {
		const resourceKey : any = GetUrlResourceKey();
		if (resourceKey !== "") {
			const resourceType : string = "dir";
			const resourceName : string = "";
			setSelectedResource({resourceType, resourceKey, resourceName});
		}

		const pathName = window.location.pathname;
		if (pathName === "/disk/trash") setClearTrash(true);
		
	},[window.location.search])

	useEffect(() => {
		if (selectedResource.resourceKey && contextMenuClick === false) loadListCount();
	},[selectedResource]);
	
	useEffect(() => {
		if (listCount > 0) {
			setPage(Math.ceil(listCount/limit));
			loadList();
		}
	},[listCount]);

	useEffect(() => {
		if (page > 0 && currentPage <= page) loadList();
	},[currentPage]);

	useEffect(() => {
		const listSortArray = listSort.split('_');
		setSortName(listSortArray[0]);
		setSortDirection(listSortArray[1]);
	},[listSort]);

	useEffect(() => {
		if (listCount > 0) {
			setCurrentPage(1);
			setList([{'resourceType':'','resourceKey':'','resourceName':'','maker':'','makerKey':'','parentKey':'','childFolderCount':0,'fileExt':'','fileSize':'','folderType':'','folderUsage':0,'hidden':'N','createDate':'','updateDate':'','lastModifyDate':'','deleteDate':'', 'selected':false}]);
			loadList();
		}
	},[sortName, sortDirection]);

	const [rangeResourceKey, setRangeResourceKey] = useState<any>([{'rangeResourceType':'','rangeResourceKey':''}]);
	const [endRangeResourceKey, setEndRangeResourceKey] = useState('');

	const handleListItemClick = (event:any, resourceType:string, resourceKey:string, resourceName:string) => {
		setRangeResourceKey([{'rangeResourceType':'','rangeResourceKey':''}]);
		list.map((list)=>{
			list.selected = false;
		})
		if (event.shiftKey) {
			setRangeResourceKey([{'rangeResourceType':'','rangeResourceKey':''}]);
			setEndRangeResourceKey(resourceKey);
			return;
		}
		setSelectedResource({resourceType, resourceKey, resourceName});
	};

	const [doubleClick, setDoubleClick] = useState(1);
	const [clearTrash, setClearTrash] = useState(false);

	const handleDoubleClick = (event:any, resourceType:string, resourceKey:string, resourceName:string) => {
		setSelectedResource({resourceType, resourceKey, resourceName});
		setDoubleClick(doubleClick => doubleClick + 1);
	}

	useEffect(() => {
		let range = false;
		let endResourceKey = '';
		let desc = false;
		let asc = false;
		list.filter(list => list.resourceKey !== '').map((list) => {
			if (!asc && list.resourceKey === selectedResource.resourceKey) { 
				range = true;			
				endResourceKey = endRangeResourceKey;
				desc = true;
			} 
			if (!desc && list.resourceKey === endRangeResourceKey) { 
				range = true;			
				endResourceKey = selectedResource.resourceKey;
				asc = true;
			}
			if (range === true) {
				setRangeResourceKey((prev:any[]) => [...prev, {rangeResourceType:list.resourceType,rangeResourceKey:list.resourceKey}]);
				list.selected = true;
			}
			if (list.resourceKey === endResourceKey) {
				range = false;
			}
		});
	},[endRangeResourceKey]);


	useEffect(() => {
		if (selectedResource.resourceType === "dir") {
			const pathName = window.location.pathname;
			window.location.href = pathName.slice(-1, 0) + '?resourceKey=' + selectedResource.resourceKey;
		}
	},[doubleClick]);

	const initialState = {
		mouseX: 0,
		mouseY: 0,
		};
	const [context, setContext] = useState(initialState);
                                                                                                                                                                                
	const handleClick = (event:any, resourceType:string, resourceKey:string, resourceName:string) => {
		event.preventDefault();
		if (event.type === 'contextmenu') setContextMenuClick(true);
		else setContextMenuClick(false);
		setContext({
			mouseX: event.clientX - 2,
			mouseY: event.clientY - 4,
		});
		setSelectedResource({resourceType, resourceKey, resourceName});
	};

	const handleClose = () => {
		setContext(initialState);
	};


	const handleDelete = (clear:string) => {
		setContext(initialState);
		let clearTrash : boolean = false;
		if (clear === "true") clearTrash = true;

		const contentsDelete = delDelete(selectedResource, rangeResourceKey, folderType, clearTrash);
		contentsDelete.then(function(res) {
			const resourceKey = GetUrlResourceKey();
			if (resourceKey !== '') {
				const resourceType : string = "dir";
				const resourceName : string = "";
				setSelectedResource({resourceType, resourceKey, resourceName});
			}
			if (res.data.result === "F") {
				setInfoSnackBar({mode: 'delete', type: 'error', code: 'DELETE002'});
				console.log('error : delete');
				console.log(res);
			} else {
				setInfoSnackBar({mode: 'delete', type: 'success', code: 'DELETE001'});
				console.log('success : delete');
				if (rangeResourceKey.length > 1) {
					setList(list.filter(list => rangeResourceKey.map((rangeResourceKey:any)=>rangeResourceKey.rangeResourceKey).indexOf(list.resourceKey) < 0));
					setRangeResourceKey([{'rangeResourceType':'','rangeResourceKey':''}]);
				} else {
					setList(list.filter(list => list.resourceKey !== selectedResource.resourceKey));
					setSelectedResource({'resourceType':'', 'resourceKey':'', 'resourceName':''});
				}
			}
		});
		handleClose();
	}

	useEffect(() => {
		const folderType = GetFolderTypeFromPathname();
		setFolderType(folderType);
	},[]);


	const [renameOpen, setRenameOpen] = useState(false);
	const [rename, setDialogRename] = useState<string>('');
	const [fileExtName, setDialogFileExtName] = useState<string>('');
	const [chkRenameLength, setChkRenameLength] = useState(false);
	const handleClickRename = () => {
		setRenameOpen(false);
		const contentsRename = setRename(selectedResource, folderType, rename);
		contentsRename.then(function(res) {
			//아래 setSelectedIdx 세팅이 없으면 resourceKey=0 을 한번 더 불러와서 root의 리스트를 세팅하는 문제가 발생한다
			//스크롤링이 되면 하단에 root 의 리스트가 세팅되어 버림
			const prevSelectedResourceKey = selectedResource.resourceKey;
			const resourceKey = GetUrlResourceKey();
			if (resourceKey !== '') {
				const resourceType : string = "dir";
				const resourceName : string = "";
				setSelectedResource({resourceType, resourceKey, resourceName});
			}
			if (res.data.result === "F") {
				setInfoSnackBar({mode: 'rename', type: 'error', code: 'RENAME002'});
				console.log(res);
			} else {
				setInfoSnackBar({mode: 'rename', type: 'success', code: 'RENAME001'});
				setList([{'resourceType':'','resourceKey':'','resourceName':'','maker':'','makerKey':'','parentKey':'','childFolderCount':0,'fileExt':'','fileSize':'','folderType':'','folderUsage':0,'hidden':'N','createDate':'','updateDate':'','lastModifyDate':'','deleteDate':'', 'selected':false}]);
				list.filter(list => list.resourceKey === prevSelectedResourceKey).map((list) => list.resourceName = rename + fileExtName);
				setList(list);
			}
		});
	}
	const handleClickRenameOpen = () => {
		const fileName = selectedResource.resourceName.replace(/\.[^/.]+$/,'');
		const fileExtName = ( selectedResource.resourceType === "file" ) ? "." + selectedResource.resourceName.substring(selectedResource.resourceName.lastIndexOf(".")+1) : "";
		setDialogRename(fileName);
		setDialogFileExtName(fileExtName);
		setRenameOpen(true);
		handleClose();
	};
	const handleClickRenameClose = () => {
		setChkRenameLength(false);
		setRenameOpen(false);
	};
	const handleRenameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		let renameValue = e.target.value;
		if (CountContentsLength(renameValue) > 255) setChkRenameLength(true);
		else setChkRenameLength(false);
		setDialogRename(renameValue);
	}
	const handleRenameFocus = (e:React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		e.target.select();
	}


	const [newFolderOpen, setNewFolderOpen] = useState(false);
	const [newFolderName, setNewFolderName] = useState<string>('');
	const [chkNewFolderLength, setChkNewFolderLength] = useState(false);
	const handleClickNewFolder = () => {
		setNewFolderOpen(false);
		const resourceKey = GetUrlResourceKey();
		const contentsNewFolder = setNewFolder(resourceKey, folderType, newFolderName);
		contentsNewFolder.then(function(res) {
			if (res.data.result === "F") {
				setInfoSnackBar({mode: 'newfolder', type: 'error', code: 'NEWFOLDER002'});
				console.log(res);
			} else {
				setInfoSnackBar({mode: 'newfolder', type: 'success', code: 'NEWFOLDER001'});
				setList(prev => ([res.data.info[0], ...prev]));
			}
		});
	}

	const handleClickNewFolderOpen = () => {
		setNewFolderOpen(true);
		handleClose()
	};
	const handleClickNewFolderClose = () => {
		setChkNewFolderLength(false);
		setNewFolderOpen(false);
	};
	const handleNewFolderNameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		let newFolderValue = e.target.value;
		if (CountContentsLength(newFolderValue) > 255) setChkNewFolderLength(true);
		else setChkNewFolderLength(false);
		setNewFolderName(newFolderValue);
	}


	const [copyAndMoveOpen, setCopyAndMoveOpen] = useState(false);
	const [pasteDir, setPasteDir] = useState(getRootResourceKey('mydisk'));
	const [chkPasteDir, setChkPasteDir] = useState(false);
	const handleCopyAndMoveClick = () => {
		setChkPasteDir(false);
		setCopyAndMoveOpen(true);
		handleClose();
	};
	const handleCopyAndMoveClose = () => {
		setChkPasteDir(false);
		setCopyAndMoveOpen(false);
	};
	const handlePaste = (type:any) => {
		const currentResourceKey = GetUrlResourceKey();
		if (currentResourceKey === pasteDir) {
			setChkPasteDir(true);
			return false;
		}
		const contentsPaste = setPaste(type, pasteDir, selectedResource, rangeResourceKey, folderType);
		contentsPaste.then(function(res) {
			if (res.data.result === "F") {
				console.log('error : paste');
				console.log(res);
			} else {
				console.log('success : paste');
				//TO-BE : 리프레쉬가 아니라 해당 항목만 제거하는 방식으로 변경해야 함
				window.location.reload(false);
			}
		});
		handleClose();
	}


	const handleRestore = () => {
		setContext(initialState);

		const contentsRestore = setRestore(selectedResource, rangeResourceKey, folderType);
		contentsRestore.then(function(res) {
			if (res.data.result === "F") {
				setInfoSnackBar({mode: 'restore', type: 'error', code: 'RESTORE001'});
				console.log(res);
			} else {
				setInfoSnackBar({mode: 'restore', type: 'success', code: 'RESTORE001'});
				if (rangeResourceKey.length > 1) {
					setList(list.filter(list => rangeResourceKey.map((rangeResourceKey:any)=>rangeResourceKey.rangeResourceKey).indexOf(list.resourceKey) < 0));
					setRangeResourceKey([{'rangeResourceType':'','rangeResourceKey':''}]);
				} else {
					setList(list.filter(list => list.resourceKey !== selectedResource.resourceKey));
					setSelectedResource({'resourceType':'', 'resourceKey':'', 'resourceName':''});
				}
			}
		});
		handleClose();
	}


	const [downProgress, setDownProgress] = useState(0);
	const [multiDownName, setMultiDownName] = useState('');
	const [downloadProgressOpen, setDownloadProgressOpen] = useState(false);
	const [multiDownCompleted, setMultiDownCompleted] = useState(false);
	const singleDownloadFormRef = useRef(null);
	const multiDownloadFormRef = useRef(null);
	const token = getToken();
	const singleDownloadUrl = ServerInfo + Download;
	const multiDownloadUrl = ServerInfo + MultiDownload;
	const [formRangeResourceKey, setFormRangeResourceKey] = useState([]);

	const handleDown = () => {
		setContext(initialState);

		let rangeResourceKeyCount = rangeResourceKey.filter((element:any) => element.rangeResourceKey !== '').length;
		//setDownloadProgressOpen(true);

		if (selectedResource.resourceType === "dir" || rangeResourceKeyCount > 0) {
			/*const multiDownload = getMultiDownload(selectedResource, rangeResourceKey, folderType, setDownProgress);
			const today = new Date();
			const resultToday = today.toISOString().split('T')[0];
			const multiFileName = 'Drive-' + resultToday + '.zip';
			setMultiDownName(multiFileName);

			multiDownload.then (response => {
				const type = response.headers['content-type'];
				const blob = new Blob([response.data], { type: type + ';charset:UTF-8' });
				const link = document.createElement('a');
				link.href = window.URL.createObjectURL(blob);
				link.download = multiFileName;
				link.click();
				setMultiDownCompleted(true);
				link.remove();
			});*/

			/*let rangeArrayResourceKey = [];
			if (rangeResourceKeyCount > 0) {
				rangeResourceKey.map((list) => {
					if (list.rangeResourceKey !== '') {
						rangeArrayResourceKey.push(list.rangeResourceKey);
					}
				})
			} else if (selectedResource) {
				rangeArrayResourceKey.push(selectedResource.resourceKey);
			}*/

			multiDownloadFormRef.current.submit();
		} else {
			/*const fileDownload = getFileDownload(selectedResource, folderType, setDownProgress);
			fileDownload.then (response => {
				const type = response.headers['content-type'];
				const blob = new Blob([response.data], { type: type + ';charset:UTF-8' });
				const link = document.createElement('a');
				link.href = window.URL.createObjectURL(blob);
				link.download = selectedResource.resourceName;
				link.click();
				link.remove();
			});*/
			singleDownloadFormRef.current.submit();
		};

		handleClose()
	}


	const [permanentDeleteOpen, setPermanentDeleteOpen] = useState(false);
	const handlePermanentDeleteClick = () => {
		setPermanentDeleteOpen(true);
		handleClose();
	};
	const handlePermanentDeleteClose = () => {
		setPermanentDeleteOpen(false);
	};
	const handleSetPermanentDelete = () => {
		handleDelete(true);
		setPermanentDeleteOpen(false);
	};

	useEffect(() => {
		let rangeResourceKeyCount = rangeResourceKey.filter((element) => element.rangeResourceKey !== '').length;
		let rangeArrayResourceKey = [];
		if (rangeResourceKeyCount > 0) {
			rangeResourceKey.map((list) => {
				if (list.rangeResourceKey !== '') {
					rangeArrayResourceKey.push(list.rangeResourceKey);
				}
			})
		} else if (selectedResource) {
			rangeArrayResourceKey.push(selectedResource.resourceKey);
		}
		setFormRangeResourceKey(rangeArrayResourceKey);
	},[rangeResourceKey])

	useEffect(() => {
		list.map(list => {
				list.selected = false;
				if(rangeResourceKey.find(elm => elm.rangeResourceKey ===list.resourceKey))
				list.selected = true;
		})
		console.log(rangeResourceKey)
	},[rangeResourceKey])

	const handleMouseOver = (e) => {
		e.target.classList.add('Mui-focusVisible')
	}

	const handleMouseOut = (e) => {
		e.target.classList.remove('Mui-focusVisible');
	}

	return (
		<div className="list_wrapper">
		    {list.filter(list => list.resourceKey !== "").map((list) => {
				  let date = moment(list.createDate).format('YYYY-MM-DD');
				  let size = (list.fileSize) ? GetFormatBytes(list.fileSize):'';
				return (
					<div key={list.resourceKey} className="disk_list" style={{cursor: 'context-menu'}}>
						
						<ListItem className="list"
								  k={list.resourceKey}
								  t={list.resourceType}
								  selected={selectedResource.resourceKey === list.resourceKey || list.selected === true} 
								  onClick={(event) => handleListItemClick(event, list.resourceType, list.resourceKey, list.resourceName)}
								  onDoubleClick={(event) => handleDoubleClick(event, list.resourceType, list.resourceKey, list.resourceName)}
								  onContextMenu={(event) => handleClick(event, list.resourceType, list.resourceKey, list.resourceName)}
								  onMouseOver={handleMouseOver}
								  onMouseOut={handleMouseOut}
								  >
							<div>
								{list.resourceType === "dir" ? 
									<FolderOutlinedIcon style={{color:yellow[600], fontSize:30}}/>
									:<InsertDriveFileOutlinedIcon style={{color:grey[600], fontSize:30}}/>}
							</div>
							<div className="disk_list_name" title={list.resourceName}>{list.resourceName}</div> 
							<div className="disk_column_owner">{t('own')}{/*{list.maker}*/}</div> 
							<div className="disk_column_date">{date}</div>
							<div className="disk_column_size">{size}</div>
						</ListItem>
					</div>
				);
			})}
			{emptyFolder === true && 
				<div className="empty_folder">
					<div><Typography>{t('emptyFolder')}</Typography></div>
					<div><BatteryCharging20Icon style={{color:blue[500],fontSize:100}}/></div>
				</div>}
	  		
			<div ref={target} onLoad={() => loadList()}>{loading && "Loading..."}</div>
			
			<form ref={singleDownloadFormRef} name="singleDownloadForm" method="post" action={singleDownloadUrl}>
      			<input key="1" type="hidden" name='accessToken' value={token} />
				<input key="2" type="hidden" name='resourceKey' value={selectedResource.resourceKey} />
				<input key="3" type="hidden" name='folderType' value={folderType} />
      		</form>				
			<form ref={multiDownloadFormRef} name="multiDownloadForm" method="post" action={multiDownloadUrl}>
      			<input key="4" type="hidden" name='accessToken' value={token} />
				{formRangeResourceKey.map((list) => {
						return <input key={list} type="hidden" name='resourceKey[]' value={list} />
					})
				}
				<input key="5" type="hidden" name='folderType' value={folderType} />
      		</form>

			<Menu
				keepMounted
				open={context.mouseY !== 0}
				onClose={handleClose}
				anchorReference="anchorPosition"
				anchorPosition={
				context.mouseY !== 0 && context.mouseX !== 0
					? { top: context.mouseY, left: context.mouseX }
					: undefined
				}>
				{clearTrash === true ? 
					<div>
						<MenuItem onClick={()=>handleRestore()}>{t('restore')}</MenuItem>
						<MenuItem onClick={handlePermanentDeleteClick}>{t('permanentDelete')}</MenuItem>
					</div>
					:
					<div>
						<MenuItem onClick={handleDown}>{t('download')}</MenuItem>
						<MenuItem onClick={handleClickNewFolderOpen}>{t('newFolder')}</MenuItem>
						<MenuItem onClick={()=>handleDelete('false')}>{t('delete')}</MenuItem>
						<MenuItem onClick={handleClickRenameOpen}>{t('rename')}</MenuItem>
						<MenuItem onClick={handleCopyAndMoveClick}>{t('contentsCopy')}</MenuItem>
						<MenuItem onClick={handleCopyAndMoveClick}>{t('contentsMove')}</MenuItem>
					</div>
				}
			</Menu>
			<RenameDialog 
				renameOpen={renameOpen} 
				handleClickRenameClose={handleClickRenameClose} 
				rename={rename} 
				fileExtName={fileExtName}
				handleRenameChange={handleRenameChange} 
				handleRenameFocus={handleRenameFocus} 
				handleClickRename={handleClickRename}
				chkRenameLength={chkRenameLength}
			/>
			<NewFolderDialog 
				newFolderOpen={newFolderOpen} 
				handleClickNewFolderClose={handleClickNewFolderClose} 
				newFolderName={newFolderName} 
				handleNewFolderNameChange={handleNewFolderNameChange} 
				handleClickNewFolder={handleClickNewFolder}
				chkNewFolderLength={chkNewFolderLength}
			/>
			<CopyAndMoveDialog
				copyAndMoveOpen={copyAndMoveOpen}
				handleCopyAndMoveClose={handleCopyAndMoveClose}
				handlePaste={handlePaste}
				setPasteDir={setPasteDir}
				chkPasteDir={chkPasteDir}
				setChkPasteDir={setChkPasteDir}
			/>
			<DownloadSnackBar
				downloadProgressOpen={downloadProgressOpen}
				setDownloadProgressOpen={setDownloadProgressOpen}
				downProgress={downProgress}
				downName={selectedResource.resourceName}
				multiDownName={multiDownName}
				multiDownCompleted={multiDownCompleted}
			/>
			<InfoSnackBar
				infoSnackBar={infoSnackBar}
				setInfoSnackBar={setInfoSnackBar}
			/>
			<PermanentDeleteDialog
				permanentDeleteOpen={permanentDeleteOpen}
				handlePermanentDeleteClose={handlePermanentDeleteClose}
				handleSetPermanentDelete={handleSetPermanentDelete}
			/>
 
			<Selecto
				dragContainer={".list_wrapper"}
				selectableTargets={[".list"]}
				hitRate={0}
				selectByClick={true}
				selectFromInside={true}
				ratio={0}
				onSelect={e => {
					e.added.forEach(el => {
						setRangeResourceKey(prev => [...prev, {'rangeResourceType':el.getAttribute('t'),'rangeResourceKey':el.getAttribute('k')}]);
					});
					e.removed.forEach(el => {
						setRangeResourceKey([{'rangeResourceType':'','rangeResourceKey':''}]);
					});
				}}
			/>
	  </div>
	);
};

export default DiskList;