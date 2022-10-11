import { HelpOutlineOutlined } from "@mui/icons-material";
import { 
	Box, 
	ClickAwayListener, 
	styled, 
	Tooltip, 
	tooltipClasses,
	TooltipProps, 
	useMediaQuery, 
} from "@mui/material";
import { FunctionComponent, useState } from "react";
import { DESKTOP_CELL_SIZE, MOBILE_CELL_SIZE, MOBILE_CUTOFF, NUM_COLS } from "../constants";

const TitleContainer: FunctionComponent = () => {
	// State
	const [tooltipOpen, setTooltipOpen ] = useState(false);

	// Styling
  	const isMobile = useMediaQuery(`(max-width:${MOBILE_CUTOFF}px)`);
  	const cellSize = isMobile ? MOBILE_CELL_SIZE : DESKTOP_CELL_SIZE;
	const boardWidth = NUM_COLS*cellSize;
    const helpText = (
		<Box sx={{ 
			padding: `${isMobile ? 0.3 : 1}rem` ,
			fontSize: `${isMobile ? 0.6 : 1}rem` ,
		}}>
			{isMobile ? 'Click on ' : 'Hover over '} a cell and click on one of the
 	   		HEIGHT×WIDTH buttons to add a block of that size. A valid board contains 
			<b> exactly one </b> 2×2 block and <b> exactly two </b> free spaces. 
			You can also click <em> Create Board For Me </em> to get a random board.
			Move the 2×2 block to the red area at the bottom of the board to win!
		</Box>
	);
	const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
		<ClickAwayListener onClickAway={() => setTooltipOpen(false)}>
	  		<Tooltip {...props} classes={{ popper: className }} />
		</ClickAwayListener>
	))({
	  [`& .${tooltipClasses.tooltip}`]: {
		maxWidth: `${boardWidth + (isMobile ? 2 : cellSize)}rem`,
		marginLeft: 'auto',
		marginRight: 'auto',
	  },
	});

    return (
		<StyledTooltip open={tooltipOpen} title={helpText} arrow>
			<Box sx={{ 
				display: 'flex', 
				alignItems: 'end', 
				justifyContent: 'center', 
				marginTop: '2rem',
				height: `${isMobile ? 2.5 : 5.5}rem`,
			}}>
				<Box sx={{ 
					height: '100%',
					fontSize: `${isMobile ? 2.3 : 5}rem`,
					fontWeight: '400',
					padding: 0,
				}}>
					KLOTSKI SOLVER
				</Box>
				<HelpOutlineOutlined
					color="action" 
					sx={{ 
						marginLeft: '0.5rem', 
						marginBottom: '-2px',
						fontSize: `${isMobile ? 1 : 1.2}rem`,
					}}
					onClick={() => { if(isMobile) setTooltipOpen(!tooltipOpen) }} 
					onMouseEnter={() => setTooltipOpen(true)}
					onMouseLeave={() => setTooltipOpen(false)}
				/>
			</Box>
		</StyledTooltip>
    );

};

export default TitleContainer;