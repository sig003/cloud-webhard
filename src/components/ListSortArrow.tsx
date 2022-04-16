import React from 'react';
import ArrowDownwardOutlinedIcon from '@material-ui/icons/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@material-ui/icons/ArrowUpwardOutlined';

function ListSortArrow(props:any) {
	const sort = props.sort;
	const chkMouseOver = props.chkMouseOver;

	return (
		<>
			{sort.sortDirection === "asc" 
				? 
					(chkMouseOver.sortName === sort.sortName && chkMouseOver.mouseOver === true 
						? 
							<ArrowUpwardOutlinedIcon fontSize="small" />
						:
							<ArrowUpwardOutlinedIcon fontSize="small" color="action" />
					)
				:
					(chkMouseOver.sortName === sort.sortName && chkMouseOver.mouseOver === true 
						? 
							<ArrowDownwardOutlinedIcon fontSize="small" />
						:
							<ArrowDownwardOutlinedIcon fontSize="small" color="action" />
					)
			}

		</>
	);
};

export default ListSortArrow;