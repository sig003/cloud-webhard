import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import Progress from './Progress';
import Typography from '@material-ui/core/Typography';
import ClearSharpIcon from '@material-ui/icons/ClearSharp';
import { useTranslation } from "react-i18next";

type Anchor = 'top' | 'left' | 'bottom' | 'right';

//To-BE : Type any 처리
function UploadRightRegion(file:any) {
	const useStyles = makeStyles({
		list: {
		  width: 250,
		},
		fullList: {
		  width: 'auto',
		},
  });

  const [styleArray, setStyleArray] = useState([{'backgroundColor':'','width':0}]);

  useEffect(() => {
    setStyleArray([]);
    //To-BE : Type any 처리
    file.progress.filter((list:any) => list.name !== "").map((list:any) => {
      setStyleArray((prev:any[]) => [...prev, {backgroundColor:'red', width:list.progress}]);
  });
  },[file]);

  const classes = useStyles();
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  //To-BE : Type any 처리
  const toggleDrawer = (anchor:Anchor, open: boolean) => (event: any) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const setCancelUpload = () => {
    file.flow.cancel();
  };

  const { t } = useTranslation();

  //To-BE : Type any 처리
    const list = (anchor:Anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div><Box p={2}><Typography variant="h6" gutterBottom>{t('uploadProgress')}</Typography></Box></div>
		 {file.file.map((list:any,index:number) => {
			return (
        <Box p={1}>
          <div key={index} style={{borderBottom:"1px solid #E0E2E6"}}>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <div style={{overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{list.file.name}</div>
              <ClearSharpIcon fontSize="small" onClick={setCancelUpload}/>
            </div>
            <Box p={1}></Box>
            <Progress progress={styleArray[index]}/>
          </div>
        </Box>
			  )
		  })}
    </div>
  );

	useEffect(() => {
    setState({ ...state, ['right']: true });
  },[]);
  
	return (
		<div>
		  <React.Fragment>
			<Drawer BackdropProps={{ invisible: true }} anchor='right' open={state['right']} onClose={toggleDrawer('right', false)}>
			  {list('right')}
			</Drawer>
		  </React.Fragment>
	  </div>
	);
};

export default UploadRightRegion;
