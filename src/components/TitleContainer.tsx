import { HelpOutlineOutlined } from "@mui/icons-material";
import { Tooltip, Box, useMediaQuery, ClickAwayListener } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { MOBILE_CUTOFF } from "../constants";

const TitleContainer: FunctionComponent<{}> = () => {
	const [tooltipOpen, setTooltipOpen ] = useState(false);
  	const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);
    const helpText = `${isMobile ? 'Click on ' : 'Hover over '} a cell and click on one of the
    HEIGHT×WIDTH buttons to add a block of that size. A valid board contains exactly one 2×2 block 
    and exactly two free spaces. You can also click 'Create Board For Me' to get a random board.`;

    return (
		<Box sx={{ 
			display: 'flex', 
			alignItems: 'center', 
			justifyContent: 'center', 
			marginTop: '2rem' 
		}}>
			<h1 style={{ padding: 0, margin: 0 }}>KLOTSKI SOLVER</h1>
			<ClickAwayListener onClickAway={() => setTooltipOpen(false)}>
				<Tooltip open={tooltipOpen} title={helpText} arrow>
					<HelpOutlineOutlined 
						color="action" 
						fontSize="small" 
						sx={{ marginLeft: '1rem' }} 
						onClick={() => setTooltipOpen(!tooltipOpen)} 
						onMouseEnter={() => setTooltipOpen(true)}
						onMouseLeave={() => setTooltipOpen(false)}
					/>
				</Tooltip>
			</ClickAwayListener>
		</Box>
    );

};

export default TitleContainer;