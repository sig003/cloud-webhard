import React from 'react';
import ListSortArrow from '../components/ListSortArrow';
import { useTranslation } from 'react-i18next';

function ListColumn(props:any) {
	const { t } = useTranslation();

	const column = [{column: 'resourceName', columnName: t('userName'), className: 'disk_column_name'},
					{column: 'owner', columnName: t('owner'), className: 'disk_column_owner'},
					{column: 'createDate', columnName: t('modifyDate'), className: 'disk_column_date'}, 
					{column: 'fileSize', columnName: t('fileSize'), className: 'disk_column_size'}];

	return (
		column.map((list) => {
			return (
				(list.column === "owner" ?
					<div key={list.column} className={list.className}>{list.columnName}</div>
					:
					<div key={list.column} className={list.className}
						onClick={() => props.handleClickSorting(list.column)} 
						onMouseOver={() => props.handleMouseOver(list.column)} 
						onMouseLeave={() => props.handleMouseLeave(list.column)}>
						{props.chkMouseOver.sortName === list.column && props.chkMouseOver.mouseOver === true ? <span style={{fontWeight:'bold'}}>{list.columnName}</span> : list.columnName}
						{props.sort.sortName === list.column ? <ListSortArrow sort={props.sort} chkMouseOver={props.chkMouseOver} /> : <div style={{width:'20px'}}></div>}
					</div>
				)
			)
		})
	);
}

export default ListColumn;