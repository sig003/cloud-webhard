import axios from 'axios';
import { getToken, getRootResourceKey } from './Auth';
import { ServerInfo, Dir, List } from '../conf/ServerInfo';
import { GetFolderTypeFromPathname } from '../lib/Contents';

interface SelectedResourceProps {
	resourceType: string;
	resourceKey: string;
	resourceName: string;
}

export const getListCount = (selectedResource:SelectedResourceProps, folderType:string) => {
	const token = getToken();

	const config = {
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': 'Bearer '+ token,
		  'X-Requested-With': 'XMLHttpRequest'
		}
	};

	let resourceKey = (selectedResource.resourceKey) ? selectedResource.resourceKey : getRootResourceKey('mydisk');
	const params = {
		resourceKey: resourceKey,
		folderType: folderType,
		useCount: true  
	};
	  
	return axios.post(ServerInfo + List, params, config);
}

export const getList = (selectedResource:SelectedResourceProps, folderType:string, page:number, sortName:string, sortDirection:string, limit:number) => {
	const token = getToken();

	const config = {
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': 'Bearer '+ token,
		  'X-Requested-With': 'XMLHttpRequest'
		}
	};

	let resourceKey = (selectedResource.resourceKey) ? selectedResource.resourceKey : getRootResourceKey('mydisk');
	const params = {
		resourceKey: resourceKey,
		folderType: folderType,
		page: page,
		limit: limit,
		sortName: sortName,
		sortDirection: sortDirection,
		useCount: false  
	};
	  
	return axios.post(ServerInfo + List, params, config);
}

export const getFolderList = (resourceKey:any, folderType:string) => {
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
		page: 0,
		limit: 0,
		//sortName: '',
		//sortDirection: '',
		useCount: false  
	};
	  
	return axios.post(ServerInfo + Dir, params, config);
}