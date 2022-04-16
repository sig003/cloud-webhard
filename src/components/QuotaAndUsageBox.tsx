import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles, withStyles, Theme } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { GetQuotaAndUsage } from '../api/File';
import { getRootResourceKey } from '../api/Auth';
import { GetFormatBytes } from '../lib/Contents';
import Box from '@material-ui/core/Box';

const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 10,
	  borderRadius: 3,
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
      borderRadius: 0,
      backgroundColor: '#1a90ff',
    },
  }),
)(LinearProgress);

function QuotaAndUsageBox() {
	const [quotaAndUsage, setQuotaAndUsage] = useState([{quota: '', usage: ''}]);
	const [progress, setProgress] = useState(0);

	const getQuotaAndUsage = () => {
		const folderType = 'mydisk';
		const resourceKey = getRootResourceKey(folderType);
		
		const contentsQuotaAndUsage = GetQuotaAndUsage(resourceKey, folderType);
		contentsQuotaAndUsage.then(function(res) {
			if (res.data.result === "F") {
				//console.log('error : chkQuotaAndUsage');
				return 'F';
			} else {
				//console.log('success : chkQuotaAndUsage');
				const quota = res.data.info.quota;
				const usage = res.data.info.usage;
				setProgress(Math.floor((usage/quota)*100));

				const transQuota = GetFormatBytes(quota);
				const transUsage = GetFormatBytes(usage);
				setQuotaAndUsage({'quota':transQuota, 'usage':transUsage});
				return 'S';
			}
		}, function(error) {
			console.log(error.response);
			if (error.response.status === 400) {
				console.log('Invalid Parameter');
				return 'F';
			}
		});
	};

	const useStyles = makeStyles({
		root: {
		  flexGrow: 1,
		  //padding: '5%',
		},
	});
	const classes = useStyles();

	useEffect(() => {
		getQuotaAndUsage();
	},[]);
	
	return (
		<div className={classes.root}>
			{quotaAndUsage.quota} 중 {quotaAndUsage.usage} 사용
			<Box p={1}></Box>
	        <BorderLinearProgress variant="determinate" value={progress} />
		</div>
	);
};

export default QuotaAndUsageBox;