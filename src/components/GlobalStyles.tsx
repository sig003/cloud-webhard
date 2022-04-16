import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const globalStyles = createGlobalStyle`
	${reset};
	a{
		text-decoration:none;
		color:inherit;
	}
	*{
		box-sizing:boerder-box;
	}
	body{
		margin:0;
		padding:0;
	}
`;

export default globalStyles;
