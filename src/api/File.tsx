
import axios from 'axios';
import { getToken } from './Auth';
import { ServerInfo, Download, MultiDownload, Delete, Paste, RenameFile, ClearTrash, NewFolder, Restore, CheckFile, FolderPath, QuotaUsage } from '../conf/ServerInfo';
import { GetUrlResourceKey } from '../lib/Contents';

interface SelectedResourceProps {
	resourceType: string;
	resourceKey: string;
	resourceName: string;
};
interface RangeSelectedResourceProps {
	rangeResourceType: string;
	rangeResourceKey: string;
};
//getFileDownload : deprecated
export const getFileDownload = (selectedResource:SelectedResourceProps, folderType:string, setDownProgress:any) => {
	const token = getToken();

	return axios({
		method: 'POST',
		url: ServerInfo + Download,
		responseType: 'blob',
		onDownloadProgress:(evt) => {
			let progress = Math.round((evt.loaded / evt.total) * 100);
			setDownProgress(progress)
		},
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer '+ token,
			'X-Requested-With': 'XMLHttpRequest'
		  },
		  params : {
			resourceKey: selectedResource.resourceKey,
			folderType: folderType
		}
	});
};
//getMultiDownload : deprecated
export const getMultiDownload = (selectedResource:SelectedResourceProps, rangeResourceKey:RangeSelectedResourceProps[], folderType:string, setDownProgress:any) => {
	const token = getToken();

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

	return axios({
		method: 'POST',
		url: ServerInfo + MultiDownload,
		responseType: 'blob',
		onDownloadProgress:(evt) => {
			//total 값이 없어서 계산이 안되고 infinity가 나온다
			//let progress = Math.round((evt.loaded / evt.total) * 100)
			//console.log(progress)
			setDownProgress(evt.loaded)
		},
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer '+ token,
			'X-Requested-With': 'XMLHttpRequest'
		  },
		  params : {
			resourceKey: rangeArrayResourceKey,
			folderType: folderType
		}
	});
};

export const delDelete = (selectedResource:SelectedResourceProps, rangeResourceKey:RangeSelectedResourceProps[], folderType:string, clearTrash:boolean) => {
	const token = getToken();
	
	const config = {
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': 'Bearer '+ token,
		  'X-Requested-With': 'XMLHttpRequest'
		}
	}
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

	const params = {
		resourceKey: rangeArrayResourceKey,
		folderType: folderType,
		clear: clearTrash
	};
	
	return axios.post(ServerInfo + Delete, params, config);
}

export const setRestore = (selectedResource:SelectedResourceProps, rangeResourceKey:RangeSelectedResourceProps[], folderType:string) => {
	const token = getToken();
	
	const config = {
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': 'Bearer '+ token,
		  'X-Requested-With': 'XMLHttpRequest'
		}
	};

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

	const params = {
		resourceKey: rangeArrayResourceKey,
		folderType: folderType
	};
	
	return axios.post(ServerInfo + Restore, params, config);	
}

export const setPaste = (type:string, pasteDir:any, selectedResource:SelectedResourceProps, rangeResourceKey:RangeSelectedResourceProps[], folderType:string) => {
	const token = getToken();
	const config = {
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': 'Bearer '+ token,
		  'X-Requested-With': 'XMLHttpRequest'
		}
	}

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

	const params = {
		actType: type,
		folderType: folderType,
		targetKey: pasteDir,
		resourceKey: rangeArrayResourceKey
	};

	return axios.post(ServerInfo + Paste, params, config);	
}

export const setRename = (selectedResource:SelectedResourceProps, folderType:string, rename:string) => {
	const token = getToken();
	const config = {
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': 'Bearer '+ token,
		  'X-Requested-With': 'XMLHttpRequest'
		}
	};

	const params = {
		resourceKey: selectedResource.resourceKey,
		folderType: folderType,
		name: rename
	};

	return axios.post(ServerInfo + RenameFile, params, config);
}

export const delClearTrash = () => {
	const token = getToken();
	const config = {
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': 'Bearer '+ token,
		  'X-Requested-With': 'XMLHttpRequest'
		}
	};

	return axios.delete(ServerInfo + ClearTrash, config);	
}

export const setNewFolder = (resourceKey:string, folderType:string, newFolderName:string) => {
	const token = getToken();
	const config = {
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': 'Bearer '+ token,
		  'X-Requested-With': 'XMLHttpRequest'
		}
	};

	const params = {
		resourceKey: resourceKey,
		folderType: folderType,
		name: newFolderName
	};

	return axios.post(ServerInfo + NewFolder, params, config);	
}

export const ChkUploadFile = (resourceKey:string, folderType:string, fileName:string) => {
	const token = getToken();

	const config = {
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': 'Bearer '+ token,
		  'X-Requested-With': 'XMLHttpRequest'
		}
	};

	const params = {
		resourceKey: resourceKey,
		folderType: folderType,
		name: fileName
	};

	return axios.post(ServerInfo + CheckFile, params, config);
}

export const getFolderPath = (resourceKey:string, folderType:string) => {
	const token = getToken();
	const config = {
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': 'Bearer '+ token,
		  'X-Requested-With': 'XMLHttpRequest'
		}
	};

	const params = {
		resourceKey: resourceKey,
		folderType: folderType
	};

	return axios.post(ServerInfo + FolderPath, params, config);
}

export const GetQuotaAndUsage = (resourceKey:string, folderType:string) => {
	const token = getToken();
	const config = {
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': 'Bearer '+ token,
		  'X-Requested-With': 'XMLHttpRequest'
		}
	};

	const params = {
		resourceKey: resourceKey,
		folderType: folderType
	};

	return axios.post(ServerInfo + QuotaUsage, params, config);
}