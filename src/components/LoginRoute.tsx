import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from '../api/Auth';

//To-BE : type any 처리
function  LoginRoute({Component, ...rest}:any) {
	return (
		<Route
			{...rest}
			render={(props) => !getToken() ? <Component {...props} /> : <Redirect to={{pathname:'/disk'}} />}
		/>
	);
};

export default LoginRoute;