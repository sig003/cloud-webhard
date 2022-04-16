import qs from 'qs';
import axios from 'axios';
import { RouteComponentProps } from "react-router-dom";
import { ServerInfo, Logout, Login, ServerStatus } from '../conf/ServerInfo';

export const getToken = () => {
	return sessionStorage.getItem('access_token') || null;
}

export const setLogout = () => {
	const logoutToken = getToken();

	const config = {
		headers: {
		  'Content-Type': 'application/json',
		  'Authorization': 'Bearer ' + logoutToken,
		  'X-Requested-With': 'XMLHttpRequest'
		}
	};
	  
	axios.get(ServerInfo + Logout, config)
	.then(response => {
		if( response.data.result === "S" ) {
			console.log("Success Logout");
		} else {
			console.log("Failed Logout");
		}
	}).catch(error => {
		console.log(error.response.data.message);
	});

	sessionStorage.removeItem('access_token');
	sessionStorage.removeItem('disk_resource_key');
	sessionStorage.removeItem('share_resource_key');
	sessionStorage.removeItem('trash_resource_key');
	sessionStorage.removeItem('user');
}

export const setToken = (token:string) => {
	sessionStorage.setItem('access_token', token);
}

export const setLogin = (email:string, password:string, props:RouteComponentProps) => {
	  const params = {
		uid: email,
		password: password
	  };
	  const config = {
		headers: {
		  'Content-Type': 'application/x-www-form-urlencoded'
		}
	  };
	  axios.post(ServerInfo + Login, qs.stringify(params), config)
	  .then(response => {
		if (response.data.result === "S") {
			setToken(response.data.access_token);
			setRootResourceKey(response.data.root_dir);
			setUserType(response.data.user);
			props.history.push('/disk/mydisk');
		} else {
			props.history.push('/login');
		}
	  }).catch(error => {
		console.log(error.response.data.message);
	  });
}

export const setRootResourceKey = (resourceKey:any) => {
	sessionStorage.setItem('mydisk_resource_key', resourceKey.mydisk);
	sessionStorage.setItem('share_resource_key', resourceKey.share);
	sessionStorage.setItem('trash_resource_key', resourceKey.trash);
}

export const getRootResourceKey = (type:string) => {
	if (type === "mydisk") {
		return sessionStorage.getItem('mydisk_resource_key') || null;
	} else if (type === "share") {
		return sessionStorage.getItem('share_resource_key') || null;
	} else if (type === "trash") {
		return sessionStorage.getItem('trash_resource_key') || null;
	}
}

export const checkServerStatus = () => {
	const config = {
		headers: {
		  'X-Requested-With': 'XMLHttpRequest'
		}
	};
	return axios.get(ServerInfo + ServerStatus, config);
}

export const setUserType = (type:string) => {
	sessionStorage.setItem('user', type);
}

export const getUserType = () => {
	return sessionStorage.getItem('user') || null;
}