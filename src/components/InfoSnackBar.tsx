import React, { useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { getDeleteMessage, getUploadMessage, getRenameMessage, getNewFolderMessage, getRestoreMessage, getUserNameMessage, getAdminMessage, getUserPasswordMessage, getUserEnableMessage } from '../lib/Message';

/**
 * 
 * @param props 
 * <Alert severity="error">This is an error message!</Alert>
 * <Alert severity="warning">This is a warning message!</Alert>
 * <Alert severity="info">This is an information message!</Alert>
 * <Alert severity="success">This is a success message!</Alert>
 */

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function InfoSnackbars(props:any) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    setMessage('');
	  props.setInfoSnackBar({mode: '', type: '', code: ''});
  };

  useEffect(() => {
    let message = '';
    const code = props.infoSnackBar.code;

    switch (props.infoSnackBar.mode) {
      case 'delete' : {
        message = getDeleteMessage(code);
        break;
      }
      case 'upload' : {
        message = getUploadMessage(code);
        break;
      }
      case 'rename' : {
        message = getRenameMessage(code);
        break;
      }
      case 'newfolder' : {
        message = getNewFolderMessage(code);
        break;
      }
      case 'restore' : {
        message = getRestoreMessage(code);
        break;
      }
      case 'username' : {
        message = getUserNameMessage(code);
        break;
      }
      case 'admin' : {
        message = getAdminMessage(code);
        break;
      }
      case 'userPassword' : {
        message = getUserPasswordMessage(code);
        break;
      }
      case 'adminUserEnable' : {
        message = getUserEnableMessage(code);
        break;
      }
      default : {
        message = '';
      }
    }
    setMessage(message);
    
  	if (props.infoSnackBar.mode !== '') handleClick();
  },[props.infoSnackBar]);

  return (
    <div className={classes.root}>
      <Snackbar 
       // anchorOrigin={{
       //   vertical: 'top',
       //   horizontal: 'center'
       // }}
        open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={props.infoSnackBar.type}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}