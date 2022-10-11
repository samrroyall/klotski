import { Box, useMediaQuery } from "@mui/material";
import { FunctionComponent } from "react";
import { DESKTOP_CELL_SIZE, MOBILE_CELL_SIZE, MOBILE_CUTOFF, NUM_COLS } from "../constants";
import { useAppSelector } from "../state/hooks";
import { Toast } from "./Toast";

const AlertContainer: FunctionComponent<{}> = () => {
	// State
	const alerts = useAppSelector((state) => state.app.alerts);

	// Styling
	const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);
  	const cellSize = isMobile ? MOBILE_CELL_SIZE : DESKTOP_CELL_SIZE;
	const boardWidth = NUM_COLS*cellSize;

	return (
    	<Box
			sx={{
				position: 'fixed',
				top: 0,
				left: '50%',
  				transform: 'translate(-50%, 0%)',
				width: `${boardWidth}rem`,
				minHeight: '3rem',
				paddingY: '1rem',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				zIndex: '30',
			}}
    	>
			{
				alerts.map(({msg, severity}, i) => (
					<Toast key={`alert-${i}`} msg={msg} severity={severity} />
				))
			}
    	</Box>
	);
};

export default AlertContainer;