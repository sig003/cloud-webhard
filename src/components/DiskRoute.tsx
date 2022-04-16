import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from '../api/Auth';

//To-BE : type any 처리
function DiskRoute({Component, ...rest}:any) {
	return (
		<Route
			{...rest}
			render={(props) => getToken() ? <Component {...props} /> : <Redirect to={{pathname:'/login', state: {from:props.location}}} />}
		/>
	)
}

export default DiskRoute;