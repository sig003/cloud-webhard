import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Box from '@material-ui/core/Box';
import { useTranslation } from "react-i18next";

function ServiceUnavailable() {
	const { t } = useTranslation();

	return (
		<>
			<div>
				<AccessTimeIcon style={{fontSize: 80}} color="action" />
			</div>
			<Box m={2}></Box>
			<div>
				<Typography variant="h4" color="textSecondary">{t('readyService')}</Typography>
			</div>
		</>
	);
}

export default ServiceUnavailable;