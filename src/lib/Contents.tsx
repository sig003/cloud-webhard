import { getRootResourceKey } from '../api/Auth';

export const CountContentsLength = (param:any) => {
	let contentsLnegth = 0;
	for(let i=0; i<param.length; i++) {
		if(escape(param.charAt(i)).length === 6) {
			contentsLnegth++;
		}
		contentsLnegth++;
	}
	return contentsLnegth;
}

export const GetUrlResourceKey = () => {
	const urlParams = new URLSearchParams(window.location.search);
	const resourceKey : any = urlParams.get('resourceKey');

	const pathName = window.location.pathname;
	const diskType = pathName.split("/")[2];
	const rootResourceKey = getRootResourceKey(diskType);

	if( resourceKey ) return resourceKey;
	else return rootResourceKey;
}

export const GetFolderTypeFromPathname = () => {
	const pathName = window.location.pathname;
	let folderType = "";
	if (pathName === "/disk/mydisk") folderType = "mydisk";
	else if (pathName === "/disk/share") folderType = "share";
	else if (pathName === "/disk/trash") folderType = "trash";
	else folderType = "mydisk";

	return folderType;
}

export const GetFormatBytes = (bytes, decimals = 1) => {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const GetUploadUniqueFileName = () => {
	return Math.random().toString(36).substring(3,9) +"_"+ new Date().getTime();
}

export const setListSort = (sortName:string, sortDirection:string) => {
	sessionStorage.setItem('sortName', sortName);
	sessionStorage.setItem('sortDirection', sortDirection);
}

export const getListSort = () => {
	return sessionStorage.getItem('sortName') + '_' + sessionStorage.getItem('sortDirection') || null;
}