import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { getFolderPath } from '../api/File';
import { GetUrlResourceKey, GetFolderTypeFromPathname } from '../lib/Contents';

function Breadcrumb() {
	const [folderType, setFolderType] = useState('');

	const handleClick = (resourceKey:string) => {
		window.location.href = '/disk/' +  folderType + '?resourceKey=' + resourceKey;
	};

	const useStyles = makeStyles((theme) => ({
		root: {
		  '& > * + *': {
			marginTop: theme.spacing(2),
		  },
		},
	  }));

	const classes = useStyles();  

	const [folderPath, setFolderPath] = useState([{resourceKey: '',dirName: ''}]);
	const [folderPathCount, setFolderPathCount] = useState(0);

	useEffect(() => {
		if (folderType !== '') {
			const resourceKey : any = GetUrlResourceKey();
			
			const contentsFolderPath = getFolderPath(resourceKey, folderType);
			contentsFolderPath.then(function(res) {
				if (res.data.result === "F") {
					console.log('error : folderPath');
					console.log(res);
				} else {
					setFolderPathCount(res.data.depthInfo.length-1);
					res.data.depthInfo.filter((element:any) => element.resourceKey !== "" && element.dirName !== "").map((list:any) => {
						setFolderPath(prev => [...prev, {resourceKey:list.resourceKey, dirName:list.dirName}]);	
					})
					//console.log('success : folderPath');
				}
			});
		}
	},[folderType]);

	useEffect(() => {
		const folderType = GetFolderTypeFromPathname();
		setFolderType(folderType);
	},[]);

	return (
		<div className={classes.root}>
			<Breadcrumbs maxItems={4} separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
				{folderPath.filter((element:any) => element.resourceKey !== "" && element.dirName !== "").map((list, index) => {
					return folderPathCount === index ? 
						<Typography key={index} color="textPrimary" >{list.dirName}</Typography> 
						:
						<Link key={index} color="inherit" href="#" onClick={() => handleClick(list.resourceKey)}>{list.dirName}</Link>
				})}
			</Breadcrumbs>
		</div>
	);
};

export default Breadcrumb;