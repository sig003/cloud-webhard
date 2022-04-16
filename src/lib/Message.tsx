export const getDeleteMessage = (code:string) => {
	let message: string = '';

	switch (code) {
		case 'DELETE001': {
			message = '삭제 완료';
			break;
		}
		case 'DELETE002': {
			message = '삭제 실패';
			break;
		}
		default : {
			message = '';
		}
	}

	return message;
}

export const getUploadMessage = (code:string) => {
	let message: string = '';

	switch (code) {
		case 'UPLOAD001': {
			message = '업로드 완료';
			break;
		}
		case 'UPLOAD002': {
			message = '업로드 실패';
			break;
		}
		default : {
			message = '';
		}
	}

	return message;
}

export const getRenameMessage = (code:string) => {
	let message: string = '';

	switch (code) {
		case 'RENAME001': {
			message = '이름 바꾸기 완료';
			break;
		}
		case 'RENAME002': {
			message = '이름 바꾸기 실패';
			break;
		}
		default : {
			message = '';
		}
	}

	return message;
}

export const getNewFolderMessage = (code:string) => {
	let message: string = '';

	switch (code) {
		case 'NEWFOLDER001': {
			message = '새 폴더 생성 완료';
			break;
		}
		case 'NEWFOLDER002': {
			message = '새 폴더 생성 실패';
			break;
		}
		default : {
			message = '';
		}
	}

	return message;
}

export const getRestoreMessage = (code:string) => {
	let message: string = '';

	switch (code) {
		case 'RESTORE001': {
			message = '복원 완료';
			break;
		}
		case 'RESTORE002': {
			message = '복원 실패';
			break;
		}
		default : {
			message = '';
		}
	}

	return message;
}

export const getUserNameMessage = (code:string) => {
	let message: string = '';

	switch (code) {
		case 'USERNAME001': {
			message = '이름 수정 완료';
			break;
		}
		case 'USERNAME002': {
			message = '이름 수정 실패';
			break;
		}
		case 'USERNAME003': {
			message = '서버 통신 에러';
			break;
		}
		default : {
			message = '';
		}
	}

	return message;
}

export const getAdminMessage = (code:string) => {
	let message: string = '';

	switch (code) {
		case 'ADMIN001': {
			message = '서버 통신 에러';
			break;
		}
		case 'ADMIN002': {
			message = '사용자 정보 수정 실페';
			break;
		}
		case 'ADMIN003': {
			message = '사용자 정보 수정 성공';
			break;
		}
		default : {
			message = '';
		}
	}

	return message;
}

export const getUserPasswordMessage = (code:string) => {
	let message: string = '';

	switch (code) {
		case 'USERPASSWORD001': {
			message = '비밀번호 변경 완료';
			break;
		}
		case 'USERPASSWORD002': {
			message = '현재 비밀번호 틀림';
			break;
		}
		case 'USERPASSWORD003': {
			message = '비밀번호 변경 실패';
			break;
		}
		case 'USERPASSWORD004': {
			message = '새 비밀번호 확인 실패';
			break;
		}
		default : {
			message = '';
		}
	}

	return message;
}

export const getUserEnableMessage = (code:string) => {
	let message: string = '';

	switch (code) {
		case 'USERENABLE001': {
			message = '상태 수정 실패';
			break;
		}
		case 'USERENABLE002': {
			message = '상태 수정 성공';
			break;
		}
		default : {
			message = '';
		}
	}

	return message;
}