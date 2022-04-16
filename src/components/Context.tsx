import React from 'react';
import { ContextMenu, MenuItem } from "react-contextmenu";
import '../css/context.css';

type ContextProps = {
	foo: string;
}

function handleClick(e: React.MouseEvent<HTMLElement>, data:ContextProps) {
	console.log(data.foo);
}

function Context() {
	return (
		<div>
		  <ContextMenu id="context-menu" className="react-contextmenu">
			<MenuItem data={{foo: 'bar'}} onClick={handleClick} className="react-contextmenu-item">
			  ContextMenu Item 1
			</MenuItem>
			<MenuItem data={{foo: 'car'}} onClick={handleClick}>
			  ContextMenu Item 2
			</MenuItem>
			<MenuItem divider />
			<MenuItem data={{foo: 'nar'}} onClick={handleClick}>
			  ContextMenu Item 3
			</MenuItem>
		  </ContextMenu>
	 
		</div>
	  );
};


export default Context;