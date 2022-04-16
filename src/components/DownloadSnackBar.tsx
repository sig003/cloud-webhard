import React, { useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import LinearProgress, { LinearProgressProps } from '@material-ui/core/LinearProgress';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number, downName: string }) {
	return (
		<Box display="flex" alignItems="center" width={300}>
			<Box width="100%" mr={1}>
				<Typography variant="body2" color="textSecondary" noWrap={true} style={{width:'250px'}} title={props.downName}>{props.downName}</Typography>
				<LinearProgress variant="determinate" {...props} />
			</Box>
			<Box minWidth={35}>
				<Typography variant="body2" color="textSecondary">{`${Math.round(
				props.value,
				)}%`}</Typography>
			</Box>
		</Box>
	);
} 

function MultiLinearProgressWithLabel(props: LinearProgressProps & { value: number, multiDownName: string, multiDownCompleted: boolean }) {
	const [size, setDownSize] = useState(0);

	useEffect(() => {
		const downSize = props.value/1024/1024;
		//Math.ceil(downSize * 100) / 100 => 소수점 2자리까지 표현 가능
		const transDownSize = Math.ceil(downSize * 10) / 10;
		//toFixed 는 문제가 있다고 하여 위와 같이 계산
		//Number 또는 parseFloat 로 처리하면 1.0 은 1로 나옴. 그러면 용량 표시할때 왔다갔다 하게됨. 그래서 아래와 같이 정수일때 임의로 .0을 붙여줌
		//const transDownSize = Number(downSize.toFixed(1))
		setDownSize(transDownSize)
	},[props.value])
	
	return (
		<Box display="flex" alignItems="center" width={300}>
			<Box width="100%" mr={1}>
				<Typography variant="body2" color="textSecondary" noWrap={true} style={{width:'250px'}} title={props.multiDownName}>{props.multiDownName}</Typography>
				{props.multiDownCompleted === true ? <LinearProgress variant="determinate" />:<LinearProgress />}
				
			</Box>
			<Box minWidth={35}>
				<Typography variant="body2" color="textSecondary">{Number.isInteger(size) === true ? size+'.0':size}MB</Typography>
			</Box>
		</Box>
	);
} 

function DownloadSnackBar(props:any) {
	const handleDownloadProgressClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
		if (reason === 'clickaway') {
		  return;
		}
	
		props.setDownloadProgressOpen(false);
	};
	return (
		<div>
			<Snackbar
				anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
				}}
				open={props.downloadProgressOpen}
				onClose={handleDownloadProgressClose}
				//autoHideDuration={6000}
			>
				<SnackbarContent 
					style={{backgroundColor:'#FFFFFF',}}  
					message={ props.multiDownName !== "" ? <MultiLinearProgressWithLabel value={props.downProgress} multiDownName={props.multiDownName} multiDownCompleted={props.multiDownCompleted}/>:<LinearProgressWithLabel value={props.downProgress} downName={props.downName} />}
					action={
						<React.Fragment>
							<IconButton size="small" aria-label="close" style={{color:'gray'}} onClick={handleDownloadProgressClose}>
							<CloseIcon fontSize="small" />
							</IconButton>
						</React.Fragment>
						}
				/>
			</Snackbar>
	  	</div>
	);
};

export default DownloadSnackBar;