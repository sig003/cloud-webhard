export const CheckNumber = (param:any) => {
	const regExp = /^(\s*|\d+)$/;
	if( regExp.test(param) === true ) {
		return true;
	} else {
		console.log('Invalid Parameter')
		return false;
	}
}