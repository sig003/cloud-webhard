import axios from 'axios';
import { getToken } from './Auth';
import { ServerInfo, AdminUserInfo, AdminUserList, UserEnable, AdminUserUpdate } from '../conf/ServerInfo';

export const getAdminUserList = () => {
	const token = getToken();
	const config = {
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': 'Bearer '+ token,
		  'X-Requested-With': 'XMLHttpRequest'
		}
	};
	const params = {
		page: 1,
		limit: 1000,
		sortName: 'name',
		sortDirection: 'desc',
		useCount: false  
	};

	return axios.post(ServerInfo + AdminUserList, params, config);	
}
export const getAdminUserInfo = (memberKey:string) => {
	const token = getToken();
	const config = {
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': 'Bearer '+ token,
		  'X-Requested-With': 'XMLHttpRequest'
		}
	};
	const params = {
		memberKey: memberKey
	};

	return axios.post(ServerInfo + AdminUserInfo, params, config);	
}
export const setAdminUserEnable = (memberKey:string, enable:boolean) => {
	const token = getToken();
	const config = {
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': 'Bearer '+ token,
		  'X-Requested-With': 'XMLHttpRequest'
		}
	};
	const params = {
		memberKey: memberKey,
		enable: enable
	};

	return axios.post(ServerInfo + UserEnable, params, config);	
}
export const setAdminUserInfo = (memberKey:string, name:string, type:string) => {
	const token = getToken();
	const config = {
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': 'Bearer '+ token,
		  'X-Requested-With': 'XMLHttpRequest'
		}
	};
	const params = {
		memberKey: memberKey,
		name: name,
		userType: type
	};

	return axios.post(ServerInfo + AdminUserUpdate, params, config);	
}