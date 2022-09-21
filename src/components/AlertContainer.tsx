import { Box } from "@mui/material";
import { FunctionComponent } from "react";
import { useAppSelector } from "../state/hooks";
import { Toast } from "./Toast";

const AlertContainer: FunctionComponent<{}> = () => {
	const alerts = useAppSelector((state) => state.app.alerts);

	return (
    	<Box
			sx={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				height: '3rem',
				paddingY: '1rem',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				zIndex: '30',
			}}
    	>
			{alerts.map(({msg, severity}, i) => <Toast key={`alert-${i}`} msg={msg} severity={severity} />)}
    	</Box>
	);
};

export default AlertContainer;