import axios from 'axios';
import { getToken } from './Auth';
import { ServerInfo, UserInformation, UpdateUserInfo, ModifyUserPassword } from '../conf/ServerInfo';

export const getUserInfo = () => {
	const token = getToken();
	const config = {
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': 'Bearer '+ token,
		  'X-Requested-With': 'XMLHttpRequest'
		}
	};

	return axios.get(ServerInfo + UserInformation, config);	
}

export const setRenameUser = (rename:string) => {
	const token = getToken();
	const config = {
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': 'Bearer '+ token,
		  'X-Requested-With': 'XMLHttpRequest'
		}
	};

	const params = {
		name: rename
	};

	return axios.post(ServerInfo + UpdateUserInfo, params, config);	
}

export const setModifyUserPassword = (currentPassword:string, newPassword:string, ConfirmPassword:string) => {
	const token = getToken();
	const config = {
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': 'Bearer '+ token,
		  'X-Requested-With': 'XMLHttpRequest'
		}
	};

	const params = {
		password: currentPassword,
		newPassword: newPassword,
	};

	return axios.post(ServerInfo + ModifyUserPassword, params, config);	
}