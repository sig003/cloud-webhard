import React, { useState, useEffect } from 'react';
import { setLogin } from '../api/Auth';
import '../css/login.css';
import { TextField, Button, Checkbox } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { RouteComponentProps } from "react-router-dom";
import { checkServerStatus } from '../api/Auth';
import ServiceUnavailable from '../components/ServiceUnavailable';
import LanguageIcon from '@material-ui/icons/Language';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Box from '@material-ui/core/Box';
import LanguageDialog from '../components/LanguageDialog';
import { useTranslation } from 'react-i18next';

function Login(props:RouteComponentProps) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [checked, setChecked] = useState(false);
	const [error, setError] = useState('');
	const [errorMessage, setErrMessage] = useState('');
	const [serverStatus, setServerStatus] = useState('');
	const [languageOpen, setLanguageOpen] = useState(false);
	const { t } = useTranslation();

	const handleClick = () => {
	    if( email === "" ) {
		  setError('error_email'); 
		  setErrMessage(t('inputEmail'));
		} else if( password === "" ) {
			setError('error_password');
			setErrMessage(t('inputPassword'));
		}
		setLogin(email, password, props);
	}
	const onChangeEmail = (e:React.ChangeEvent<HTMLInputElement>) => {
		setError('');
		setEmail(e.target.value);
  	}
	const onChangePassword = (e:React.ChangeEvent<HTMLInputElement>) => {
		setError('');
		setPassword(e.target.value);
	}
	const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		setChecked(e.target.checked);
	}
	const handleClickLanguageOpen = () => {
		setLanguageOpen(true);
	};
	const handleClickLanguageClose = () => {
		setLanguageOpen(false);
	};

	const isEmailError = ( error === "error_email" )
    ? // or use const expression
      { error: true as true }
    : { error: false as false };
	const isPasswordError = ( error === "error_password" )
    ? // or use const expression
      { error: true as true }
	: { error: false as false };
	
	const useStyles = makeStyles({
		login_button: {
			background: '#1182DF',
			border: 'none',
			color: 'white',
			fontWeight: 'bold',
			fontSize: 18,
			width: 200,
			'&:hover': {
				backgroundColor: '#088FFF',
				border: 'none',
				boxShadow: 'none',
			},
		},
		form_label: {
			color:'#707070',
		}
	});
	const classes = useStyles();

	const EmailCheckbox = withStyles({
		root: {
		  color: '#D2D2D2',
		  '&$checked': {
			color: '#1182DF',
		  },
		},
		checked: {},
	  })(props => <Checkbox color="default" {...props} onChange={handleChange} checked={checked}/>);

	useEffect(() => {
		const serverReturn = checkServerStatus();
		serverReturn.then(response => {
			if (response.data.result === "S") {
				setServerStatus('S');
			} else {
				setServerStatus('F');
			}
		  }).catch(error => {
			  setServerStatus('F');
		  });
	},[]);

	return (
		<div className="container">
			<div className="head">
				<div>NEW</div>
				<div className="language_box" onClick={handleClickLanguageOpen}>
					<LanguageIcon fontSize="small"/>
					<Box mr={1} />
					{t('language')}
					<ExpandMoreIcon fontSize="small"/>
				</div>
			</div>
			<div className="contents">
				{serverStatus === 'F' ? 
					<ServiceUnavailable />
				:
					<>
						<div className="login_box">
							<TextField {...isEmailError} helperText={error === "error_email" ? errorMessage:''} id="email" label={t('email')} variant="outlined" size="small" value={email} onChange={onChangeEmail}/>
						</div>
						<div className="login_box">
							<TextField type="password" {...isPasswordError} helperText={error === "error_password" ? errorMessage:''} id="password" label={t('password')} variant="outlined" size="small" value={password} onChange={onChangePassword} />
						</div>
						<div>
							<FormControlLabel value="Y" className={classes.form_label} control={<EmailCheckbox />} label={t('saveEmail')} labelPlacement="end" />
						</div>
						<div className="login_box">
							<Button className={classes.login_button} variant="outlined" onClick={handleClick}>{t('login')}</Button>
						</div>
					</>
				}
			</div>

			<LanguageDialog
				languageOpen={languageOpen}
				handleClickLanguageClose={handleClickLanguageClose}
			/>
		</div> 
	);
}


export default Login;
